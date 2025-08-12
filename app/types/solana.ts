import { Connection, PublicKey } from "@solana/web3.js";

export interface TransactionResult {
  signature: string;
  success: boolean;
  error?: string;
}

export interface PDAAccounts {
  will: PublicKey;
  vault: PublicKey;
  config: PublicKey;
  feeVault: PublicKey;
}

export interface TransactionStatus {
  signature: string;
  status: "pending" | "confirmed" | "failed";
  timestamp: number;
  error?: string;
}

export interface SolanaContextType {
  connection: Connection | null;
  cluster: string;
  endpoint: string;
}
