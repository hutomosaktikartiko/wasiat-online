import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";

// Import polyfills for browser compatibility
import "../lib/polyfills";

// Import wallet adapter CSS
import "@solana/wallet-adapter-react-ui/styles.css";

// Get network from environment
const network = (import.meta.env.MODE === "production" 
  ? WalletAdapterNetwork.Mainnet 
  : WalletAdapterNetwork.Devnet) as WalletAdapterNetwork;

// Custom RPC endpoint if provided
const endpoint = import.meta.env.VITE_RPC_ENDPOINT || clusterApiUrl(network);

interface WalletProviderProps {
  children: React.ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  // Supported wallets
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider 
        wallets={wallets} 
        autoConnect={true}
        onError={(error) => {
          console.error("Wallet error:", error);
        }}
      >
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}
