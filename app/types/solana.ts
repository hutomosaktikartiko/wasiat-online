import { Connection, PublicKey } from "@solana/web3.js";

export interface PDAAccounts {
  will: PublicKey;
  vault: PublicKey;
  config: PublicKey;
  feeVault: PublicKey;
}