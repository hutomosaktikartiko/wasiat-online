import { PublicKey } from "@solana/web3.js";

export interface Will {
  testator: PublicKey;
  beneficiary: PublicKey;
  vault: PublicKey;
  heartbeatPeriod: number;
  status: WillStatus;
  createdAt: number;
  lastHeartbeat: number;
  triggerAt: number | null;
  bump: number;
  vaultBump: number;
}

export enum WillStatus {
  Created = 0,
  Active = 1,
  Triggered = 2,
  Claimed = 3,
  Withdrawn = 4,
}

export interface GlobalConfig {
  authority: PublicKey;
  feeVault: PublicKey;
  fee: number;
  tokenFeeBps: number;
  nftFeeLamports: number;
  minHeartbeatPeriod: number;
  maxHeartbeatPeriod: number;
  paused: boolean;
  bump: number;
}

export interface WillFormData {
  beneficiary: string;
  heartbeatPeriod: number;
}

export interface DepositFormData {
  amount: number;
}
