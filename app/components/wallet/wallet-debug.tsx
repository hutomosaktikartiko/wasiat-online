import React from "react";
import { WalletMultiButton as SolanaWalletMultiButton } from "@solana/wallet-adapter-react-ui";

export function WalletDebug() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Wallet Debug</h3>
      
      {/* Original Solana Wallet Button for comparison */}
      <div>
        <p className="text-sm text-muted-foreground mb-2">Original Solana Wallet Button:</p>
        <SolanaWalletMultiButton />
      </div>
    </div>
  );
}
