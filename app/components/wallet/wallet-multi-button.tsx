import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { formatAddress } from "../../lib/utils/format";

interface WalletMultiButtonProps {
  className?: string;
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function WalletMultiButton({ className, variant = "default", size = "default" }: WalletMultiButtonProps) {
  const { wallets, wallet, select, connect, disconnect, connecting, connected, publicKey } = useWallet();
  const [isOpen, setIsOpen] = useState(false);

  const handleWalletSelect = async (walletName: string) => {
    try {
      select(walletName);
      setIsOpen(false);
      // Give a small delay for wallet selection to complete
      setTimeout(async () => {
        try {
          await connect();
        } catch (error) {
          console.error("Failed to connect wallet:", error);
        }
      }, 100);
    } catch (error) {
      console.error("Failed to select wallet:", error);
    }
  };

  const handleConnect = async () => {
    if (connected) {
      disconnect();
    } else {
      // Always open wallet selection dialog
      setIsOpen(true);
    }
  };

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

  const availableWallets = wallets.filter(
    (wallet) => wallet.readyState === WalletReadyState.Installed
  );

  const notInstalledWallets = wallets.filter(
    (wallet) => wallet.readyState !== WalletReadyState.Installed
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={handleConnect}
          variant={variant}
          size={size}
          className={className}
          disabled={connecting}
        >
          {getButtonContent()}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {availableWallets.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Available Wallets</h4>
              <div className="space-y-2">
                {availableWallets.map((wallet) => (
                  <Button
                    key={wallet.adapter.name}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleWalletSelect(wallet.adapter.name)}
                  >
                    <img
                      src={wallet.adapter.icon}
                      alt={wallet.adapter.name}
                      className="w-5 h-5 mr-2"
                    />
                    {wallet.adapter.name}
                    <Badge variant="secondary" className="ml-auto">
                      Installed
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {notInstalledWallets.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">More Wallets</h4>
              <div className="space-y-2">
                {notInstalledWallets.map((wallet) => (
                  <Button
                    key={wallet.adapter.name}
                    variant="outline"
                    className="w-full justify-start opacity-60"
                    disabled
                  >
                    <img
                      src={wallet.adapter.icon}
                      alt={wallet.adapter.name}
                      className="w-5 h-5 mr-2"
                    />
                    {wallet.adapter.name}
                    <Badge variant="secondary" className="ml-auto">
                      Not Installed
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {availableWallets.length === 0 && notInstalledWallets.length === 0 && (
            <div className="text-center text-muted-foreground">
              No wallets found. Please install a Solana wallet.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
