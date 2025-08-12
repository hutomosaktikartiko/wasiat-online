import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useWallet } from "../../hooks/use-wallet";
import { formatSOL, formatAddress } from "../../lib/utils/format";
import { getClusterName, getExplorerUrl } from "../../lib/solana/connection";

export function WalletStatus() {
  const { publicKey, connected, balance, isLoading, refreshBalance, disconnect } = useWallet();

  if (!connected || !publicKey) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="text-muted-foreground mb-2">No wallet connected</div>
            <div className="text-sm text-muted-foreground">
              Connect your wallet to start using Wasiat Online
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Wallet Status</CardTitle>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Connected
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Address */}
          <div>
            <div className="text-sm font-medium mb-1">Address</div>
            <div className="flex items-center gap-2">
              <code className="text-sm bg-muted px-2 py-1 rounded">
                {formatAddress(publicKey.toString(), 6)}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigator.clipboard.writeText(publicKey.toString())}
              >
                📋
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
              >
                <a 
                  href={getExplorerUrl(publicKey.toString(), "address")} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  🔗
                </a>
              </Button>
            </div>
          </div>

          {/* Balance */}
          <div>
            <div className="text-sm font-medium mb-1">Balance</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <div className="animate-pulse bg-muted h-6 w-20 rounded" />
                ) : (
                  `${formatSOL(balance * 1_000_000_000)} SOL`
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshBalance}
                disabled={isLoading}
              >
                🔄
              </Button>
            </div>
          </div>

          {/* Network */}
          <div>
            <div className="text-sm font-medium mb-1">Network</div>
            <Badge variant="secondary">
              {getClusterName()}
            </Badge>
          </div>

          {/* Actions */}
          <div className="pt-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={disconnect}
              className="w-full"
            >
              Disconnect Wallet
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
