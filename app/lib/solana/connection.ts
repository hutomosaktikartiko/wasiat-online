import { Connection, clusterApiUrl } from "@solana/web3.js";
import { NETWORK, RPC_ENDPOINT } from "../utils/constants";

/**
 * Create Solana connection
 */
export function createConnection(): Connection {
  return new Connection(
    RPC_ENDPOINT,
    {
      commitment: "confirmed",
      confirmTransactionInitialTimeout: 60000,
    }
  );
}

/**
 * Get cluster name for display
 */
export function getClusterName(): string {
  switch (NETWORK) {
    case "mainnet-beta":
      return "Mainnet";
    case "devnet":
      return "Devnet";
    case "testnet":
      return "Testnet";
    case "custom":
      return "Custom";
    default:
      return "Unknown";
  }
}

/**
 * Get explorer URL for transaction
 */
export function getExplorerUrl(signature: string, type: "tx" | "address" = "tx"): string {
  const cluster = NETWORK === "mainnet-beta" ? "" : `?cluster=${NETWORK}`;
  return `https://explorer.solana.com/${type}/${signature}${cluster}`;
}
