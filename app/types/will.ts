import { PublicKey } from "@solana/web3.js";

// Will Status Enum - matches smart contract
export enum WillStatus {
  Created = "created",
  Active = "active", 
  Triggered = "triggered",
  Claimed = "claimed",
  Withdrawn = "withdrawn",
}

// Will Account Interface - matches IDL structure
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
  reserved: number[];
}

// Config Account Interface
export interface Config {
  authority: PublicKey;
  feeVault: PublicKey;
  tokenFeeBps: number;
  nftFeeLamports: number;
  minHeartbeatPeriod: number;
  maxHeartbeatPeriod: number;
  minHeartbeatInterval: number;
  paused: boolean;
  bump: number;
  reserved: number[];
}

// PDA Accounts for operations
export interface PDAAccounts {
  will: PublicKey;
  vault: PublicKey;
  config: PublicKey;
  feeVault: PublicKey;
}

// Will creation parameters
export interface CreateWillParams {
  beneficiary: PublicKey;
  heartbeatPeriod: number;
}

// Will operations result
export interface WillOperationResult {
  signature: string;
  success: boolean;
  error?: string;
}

// Will with additional computed properties
export interface WillWithStatus extends Will {
  isExpired: boolean;
  timeUntilExpiry: number;
  canClaim: boolean;
  canWithdraw: boolean;
  canHeartbeat: boolean;
  vaultBalance: number;
}