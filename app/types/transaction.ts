export interface TransactionStatus {
  signature: string;
  status: "pending" | "confirmed" | "failed";
  timestamp: number;
  error?: string;
}

export interface TransactionHistory {
  id: string;
  type: "create_will" | "deposit_sol" | "send_heartbeat" | "withdraw_sol" | "claim_sol" | "trigger_will";
  signature: string;
  status: TransactionStatus["status"];
  amount?: number;
  timestamp: number;
  willId?: string;
}

export interface PendingTransaction {
  signature: string;
  type: TransactionHistory["type"];
  description: string;
  timestamp: number;
}
