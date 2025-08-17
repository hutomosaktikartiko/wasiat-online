import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { LoadingSpinner } from "../ui/loading-spinner";
import { WillCard } from "./will-card";
import { useWillSearch } from "../../hooks/use-will-search";
import type { WillWithStatus } from "../../types/will";
import { useWallet } from "~/hooks/use-wallet";

interface WillSearchProps {
  onWillFound?: (will: WillWithStatus) => void;
  onWillAction?: (will: WillWithStatus, action: string) => void;
  showTips?: boolean;
}

export function WillSearch({ 
  onWillFound, 
  onWillAction,
  showTips = true,
}: WillSearchProps) {
  const [searchAddress, setSearchAddress] = useState("");
  const { will, found, isLoading, error, searchWill, clearSearch, isValidSolanaAddress } = useWillSearch();
  const { getUserRoleByWill } = useWallet();

  const handleSearch = async () => {
    const result = await searchWill(searchAddress);
    if (result.found && result.will && onWillFound) {
      onWillFound(result.will);
    }
  };

  const handleClear = () => {
    setSearchAddress("");
    clearSearch();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSearch();
    }
  };

  const isValidAddress = searchAddress.trim() === "" || isValidSolanaAddress(searchAddress.trim());

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <Card>
        <CardHeader>
          <CardTitle>🔍 Check Will Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="flex-1">
                <Label htmlFor="will-search" className="sr-only">
                  Will Address
                </Label>
                <Input 
                  id="will-search"
                  placeholder="Enter will address (Public Key)..."
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className={!isValidAddress ? "border-red-500" : ""}
                />
                {!isValidAddress && (
                  <p className="text-sm text-red-600 mt-1 break-all">
                    Invalid Solana address format
                  </p>
                )}
              </div>
              
              <div className="flex gap-2 sm:self-end">
                <Button 
                  onClick={handleSearch}
                  disabled={!searchAddress.trim() || !isValidAddress || isLoading}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Searching...
                    </>
                  ) : (
                    "🔍 Search Will"
                  )}
                </Button>
                
                {(found || error) && (
                  <Button 
                    variant="outline" 
                    onClick={handleClear}
                    className="w-full sm:w-auto"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Will address is usually provided by testator or stored in inheritance documents.
              Format: Solana Public Key (44 base58 characters).
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-red-600 text-lg">❌</span>
              <div>
                <p className="text-red-800 font-medium">Will Not Found</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {found && will && (
        <div className="space-y-4">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <span className="text-green-600 text-lg">✅</span>
                <div>
                  <p className="text-green-800 font-medium">Will Found!</p>
                  <p className="text-green-600 text-sm">
                    Will successfully found and details are displayed below.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Will Details */}
          <WillCard
            will={will}
            userRole={getUserRoleByWill(will.testator, will.beneficiary)}
            onDeposit={() => onWillAction?.(will, "deposit")}
            onHeartbeat={() => onWillAction?.(will, "heartbeat")}
            onWithdraw={() => onWillAction?.(will, "withdraw")}
            onClaim={() => onWillAction?.(will, "claim")}
            onViewDetails={() => onWillAction?.(will, "view")}
          />
        </div>
      )}

      {/* Search Tips */}
      {showTips && !found && !error && !isLoading && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900 text-lg">💡 Search Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-blue-800 min-w-0">
              <div className="flex items-start gap-2 min-w-0">
                <span className="shrink-0">•</span>
                <span className="flex-1 min-w-0 break-all">Will address is the Public Key of the will account (not vault)</span>
              </div>
              <div className="flex items-start gap-2 min-w-0">
                <span className="shrink-0">•</span>
                <span className="flex-1 min-w-0 break-all">Address format: 44 base58 characters (example: 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM)</span>
              </div>
              <div className="flex items-start gap-2 min-w-0">
                <span className="shrink-0">•</span>
                <span className="flex-1 min-w-0 break-all">If you don't have the address, contact testator or check inheritance documents</span>
              </div>
              <div className="flex items-start gap-2 min-w-0">
                <span className="shrink-0">•</span>
                <span className="flex-1 min-w-0 break-all">Make sure the entered address is will address, not wallet address</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
