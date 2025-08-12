import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { formatAddress } from "../../lib/utils/format";

interface WalletButtonProps {
  className?: string;
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function WalletButton({ className, variant = "default", size = "default" }: WalletButtonProps) {
  const { wallet, connect, disconnect, connecting, connected, publicKey } = useWallet();

  const handleClick = React.useCallback(() => {
    if (connected) {
      disconnect();
    } else if (wallet?.readyState === WalletReadyState.Installed) {
      connect();
    } else {
      // Open wallet selection modal
      // This will be handled by WalletModalProvider
    }
  }, [wallet, connect, disconnect, connected]);

  const getButtonContent = () => {
    if (connecting) {
      return (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
          Connecting...
        </>
      );
    }

    if (connected && publicKey) {
      return (
        <>
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
          {formatAddress(publicKey.toString(), 4)}
        </>
      );
    }

    return "Connect Wallet";
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={className}
      disabled={connecting}
    >
      {getButtonContent()}
    </Button>
  );
}
