import React, { useState, useEffect } from "react";
import { WalletMultiButton as SolanaWalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Button } from "../ui/button";

// Client-only wrapper for wallet components
export function ClientOnlyWallet() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Server-side fallback
    return (
      <Button variant="outline">
        Connect Wallet
      </Button>
    );
  }

  // Client-side wallet component
  return <SolanaWalletMultiButton />;
}
