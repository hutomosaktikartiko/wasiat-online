import { clusterApiUrl } from "@solana/web3.js";

// Program ID untuk Wasiat Online
export const PROGRAM_ID = "A4Gbd666j7Bha4d6w231iamWYBmSYuxA7KKe42VY4Prw";

// Network configuration
const getNetworkConfig = () => {
  // Default berdasarkan mode
  if (import.meta.env.MODE === "production") {
    return { network: "mainnet-beta", endpoint: clusterApiUrl("mainnet-beta") };
  }

  // Jika ada custom RPC endpoint
  const customRpcEndpoint = import.meta.env.RPC_ENDPOINT;
  if (customRpcEndpoint) {
    if (customRpcEndpoint.includes("devnet")) {
      return { network: "devnet", endpoint: customRpcEndpoint };
    }
    if (customRpcEndpoint.includes("mainnet")) {
      return { network: "mainnet-beta", endpoint: customRpcEndpoint };
    }
    if (customRpcEndpoint.includes("localhost") || customRpcEndpoint.includes("127.0.0.1")) {
      return { network: "testnet", endpoint: customRpcEndpoint };
    }

    // Default untuk custom endpoint
    return { network: "custom", endpoint: customRpcEndpoint };
  }
  
  // Default ke test network untuk development
  return { network: "testnet", endpoint: "http://localhost:8899" };
};

const { network, endpoint } = getNetworkConfig();
export const NETWORK = network;
export const RPC_ENDPOINT = endpoint;

// PDA Seeds
export const SEEDS = {
  CONFIG: "config",
  WILL: "will", 
  VAULT: "vault",
  FEE_VAULT: "fee_vault",
} as const;

// Default values
export const DEFAULT_HEARTBEAT_PERIOD = 90 * 24 * 60 * 60; // 90 days in seconds
export const MIN_HEARTBEAT_PERIOD = 7 * 24 * 60 * 60; // 7 days in seconds
export const MAX_HEARTBEAT_PERIOD = 365 * 24 * 60 * 60; // 1 year in seconds

// UI Constants
export const LAMPORTS_PER_SOL = 1_000_000_000;
export const MAX_SOL_AMOUNT = 1000;
export const MIN_SOL_AMOUNT = 0.001;

// Toast duration
export const TOAST_DURATION = 5000;

// Transaction confirmation timeout
export const TX_CONFIRMATION_TIMEOUT = 60000; // 60 seconds
