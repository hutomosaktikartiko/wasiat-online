import * as anchor from "@coral-xyz/anchor";
const { AnchorProvider, Program } = anchor;
import { Connection, PublicKey } from "@solana/web3.js";
import type { WalletContextState } from "@solana/wallet-adapter-react";
import { IDL } from "./idl";
import type { WasiatOnline } from "./idl";
import { PROGRAM_ID } from "../utils/constants";

/**
 * Create Anchor Program instance
 */
export function createProgram(
  connection: Connection,
  wallet: WalletContextState
): anchor.Program<WasiatOnline> | null {
  if (!wallet.publicKey) {
    return null;
  }

  const provider = new AnchorProvider(
    connection,
    wallet as any,
    {
      commitment: "confirmed",
      preflightCommitment: "confirmed",
    }
  );

  return new anchor.Program<WasiatOnline>(
    IDL as any,
    provider
  );
}

/**
 * Get program with read-only provider (no wallet required)
 */
export function createReadOnlyProgram(
  connection: Connection
): anchor.Program<WasiatOnline> {
  // Create a dummy wallet for read-only operations
  const dummyWallet = {
    publicKey: new PublicKey("11111111111111111111111111111111"),
    signTransaction: async () => { throw new Error("Read-only wallet"); },
    signAllTransactions: async () => { throw new Error("Read-only wallet"); },
  };

  const provider = new AnchorProvider(
    connection,
    dummyWallet as any,
    { commitment: "confirmed" }
  );

  return new anchor.Program<WasiatOnline>(
    IDL as any,
    provider
  );
}
