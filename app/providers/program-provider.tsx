import React, { createContext, useContext, useMemo } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { PROGRAM_ID } from "../lib/utils/constants";

// Import IDL type (will be generated from Anchor)
// For now, we'll use any - replace with actual IDL type later
type WasiatOnlineIDL = any;

interface ProgramContextType {
  program: Program<WasiatOnlineIDL> | null;
  provider: AnchorProvider | null;
  programId: PublicKey;
  isConnected: boolean;
}

const ProgramContext = createContext<ProgramContextType>({
  program: null,
  provider: null,
  programId: new PublicKey(PROGRAM_ID),
  isConnected: false,
});

interface ProgramProviderProps {
  children: React.ReactNode;
}

export function ProgramProvider({ children }: ProgramProviderProps) {
  const { connection } = useConnection();
  const wallet = useWallet();

  const { program, provider, isConnected } = useMemo(() => {
    if (!wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) {
      return {
        program: null,
        provider: null,
        isConnected: false,
      };
    }

    try {
      // Create Anchor provider
      const anchorProvider = new AnchorProvider(
        connection,
        {
          publicKey: wallet.publicKey,
          signTransaction: wallet.signTransaction,
          signAllTransactions: wallet.signAllTransactions,
        },
        {
          commitment: "confirmed",
          preflightCommitment: "confirmed",
        }
      );

      // TODO: Load actual IDL
      // For now, we'll create a minimal program instance
      // This should be replaced with actual IDL loading
      const programId = new PublicKey(PROGRAM_ID);
      
      // Create program instance (simplified for now)
      // const program = new Program<WasiatOnlineIDL>(
      //   IDL,
      //   programId,
      //   anchorProvider
      // );

      return {
        program: null, // Will be set when IDL is loaded
        provider: anchorProvider,
        isConnected: true,
      };
    } catch (error) {
      console.error("Error creating program provider:", error);
      return {
        program: null,
        provider: null,
        isConnected: false,
      };
    }
  }, [connection, wallet.publicKey, wallet.signTransaction, wallet.signAllTransactions]);

  const value = useMemo(
    () => ({
      program,
      provider,
      programId: new PublicKey(PROGRAM_ID),
      isConnected,
    }),
    [program, provider, isConnected]
  );

  return (
    <ProgramContext.Provider value={value}>
      {children}
    </ProgramContext.Provider>
  );
}

export function useProgram() {
  const context = useContext(ProgramContext);
  if (!context) {
    throw new Error("useProgram must be used within a ProgramProvider");
  }
  return context;
}
