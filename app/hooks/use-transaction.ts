import { useState, useCallback } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { Transaction, VersionedTransaction } from "@solana/web3.js";
import { confirmTransaction } from "../lib/solana/utils";
import { useNotification } from "../providers/notification-provider";
import type { TransactionStatus } from "../types/transaction";

export function useTransaction() {
  const { connection } = useConnection();
  const { showLoading, dismissLoading, showSuccess, showError } = useNotification();
  const [pending, setPending] = useState<TransactionStatus[]>([]);

  const sendTransaction = useCallback(
    async (
      transaction: Transaction | VersionedTransaction,
      signTransaction: (tx: Transaction | VersionedTransaction) => Promise<Transaction | VersionedTransaction>,
      description = "Mengirim transaksi..."
    ): Promise<{ success: boolean; signature?: string; error?: string }> => {
      const loadingId = showLoading(description);
      
      try {
        // Sign transaction
        const signedTransaction = await signTransaction(transaction);
        
        // Send transaction
        const signature = await connection.sendRawTransaction(
          signedTransaction.serialize(),
          {
            skipPreflight: false,
            preflightCommitment: "confirmed",
          }
        );

        // Add to pending
        const txStatus: TransactionStatus = {
          signature,
          status: "pending",
          timestamp: Date.now(),
        };
        setPending(prev => [...prev, txStatus]);

        dismissLoading(loadingId);
        showLoading(`Mengkonfirmasi transaksi...`);

        // Wait for confirmation
        const confirmed = await confirmTransaction(connection, signature);
        
        // Update status
        setPending(prev => 
          prev.map(tx => 
            tx.signature === signature 
              ? { ...tx, status: confirmed ? "confirmed" : "failed" }
              : tx
          )
        );

        dismissLoading(loadingId);

        if (confirmed) {
          showSuccess("Transaksi berhasil!", `Signature: ${signature.slice(0, 8)}...`);
          return { success: true, signature };
        } else {
          showError("Transaksi gagal!", "Silakan coba lagi.");
          return { success: false, error: "Transaction failed to confirm" };
        }
      } catch (error) {
        dismissLoading(loadingId);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        showError("Transaksi gagal!", errorMessage);
        
        return { success: false, error: errorMessage };
      }
    },
    [connection, showLoading, dismissLoading, showSuccess, showError]
  );

  const clearPending = useCallback(() => {
    setPending([]);
  }, []);

  return {
    sendTransaction,
    pending,
    clearPending,
  };
}
