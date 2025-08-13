import { useState, useCallback } from "react";
import { Transaction, Connection, PublicKey } from "@solana/web3.js";
import type { TransactionSignature } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import { useWallet } from "./use-wallet";
import { TX_CONFIRMATION_TIMEOUT } from "../lib/utils/constants";

export interface TransactionState {
  isLoading: boolean;
  signature: string | null;
  error: string | null;
}

export interface TransactionOptions {
  onSuccess?: (signature: string) => void;
  onError?: (error: string) => void;
  skipConfirmation?: boolean;
}

export function useTransaction() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [state, setState] = useState<TransactionState>({
    isLoading: false,
    signature: null,
    error: null,
  });

  const executeTransaction = useCallback(
    async (
      transaction: Transaction,
      options: TransactionOptions = {}
    ): Promise<string | null> => {
      if (!wallet.publicKey || !wallet.signTransaction) {
        const error = "Wallet not connected";
        setState({ isLoading: false, signature: null, error });
        options.onError?.(error);
        return null;
      }

      setState({ isLoading: true, signature: null, error: null });

      try {
        // Get latest blockhash
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = wallet.publicKey;

        // Sign transaction
        const signedTransaction = await wallet.signTransaction(transaction);
        
        // Send transaction
        const signature = await connection.sendRawTransaction(
          signedTransaction.serialize(),
          {
            skipPreflight: false,
            preflightCommitment: "confirmed",
          }
        );

        setState({ isLoading: !options.skipConfirmation, signature, error: null });

        // Confirm transaction if not skipped
        if (!options.skipConfirmation) {
          const confirmation = await connection.confirmTransaction(
            {
              signature,
              blockhash,
              lastValidBlockHeight,
            },
            "confirmed"
          );

          if (confirmation.value.err) {
            throw new Error(`Transaction failed: ${confirmation.value.err}`);
          }

          setState({ isLoading: false, signature, error: null });
        }

        options.onSuccess?.(signature);
        return signature;

      } catch (err) {
        const error = err instanceof Error ? err.message : "Transaction failed";
        setState({ isLoading: false, signature: null, error });
        options.onError?.(error);
        return null;
      }
    },
    [connection, wallet]
  );

  const reset = useCallback(() => {
    setState({ isLoading: false, signature: null, error: null });
  }, []);

  return {
    ...state,
    executeTransaction,
    reset,
  };
}

// Utility function to wait for transaction confirmation
export async function confirmTransaction(
  connection: Connection,
  signature: TransactionSignature,
  commitment: "processed" | "confirmed" | "finalized" = "confirmed"
): Promise<boolean> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < TX_CONFIRMATION_TIMEOUT) {
    try {
      const result = await connection.getSignatureStatus(signature);
      
      if (result.value?.confirmationStatus === commitment) {
        return !result.value.err;
      }
      
      if (result.value?.err) {
        return false;
      }
      
      // Wait before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error checking transaction status:", error);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  return false; // Timeout
}