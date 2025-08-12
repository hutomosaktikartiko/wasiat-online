import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { LoadingSpinner } from "../ui/loading-spinner";
import { WillCard } from "./will-card";
import { useWillSearch } from "../../hooks/use-will-search";
import type { WillWithStatus } from "../../types/will";

interface WillSearchProps {
  onWillFound?: (will: WillWithStatus) => void;
  onWillAction?: (will: WillWithStatus, action: string) => void;
  userRole?: "testator" | "beneficiary" | "viewer";
  showTips?: boolean;
}

export function WillSearch({ 
  onWillFound, 
  onWillAction,
  userRole = "viewer",
  showTips = true,
}: WillSearchProps) {
  const [searchAddress, setSearchAddress] = useState("");
  const { will, found, isLoading, error, searchWill, clearSearch, isValidSolanaAddress } = useWillSearch();

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
          <CardTitle>🔍 Cek Status Wasiat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="flex-1">
                <Label htmlFor="will-search" className="sr-only">
                  Alamat Wasiat
                </Label>
                <Input 
                  id="will-search"
                  placeholder="Masukkan alamat wasiat (Public Key)..."
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className={!isValidAddress ? "border-red-500" : ""}
                />
                {!isValidAddress && (
                  <p className="text-sm text-red-600 mt-1 break-all">
                    Format alamat Solana tidak valid
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
                      Mencari...
                    </>
                  ) : (
                    "🔍 Cari Wasiat"
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
              Alamat wasiat biasanya diberikan oleh pewasiat atau tersimpan dalam dokumen warisan.
              Format: Public Key Solana (44 karakter base58).
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
                <p className="text-red-800 font-medium">Wasiat Tidak Ditemukan</p>
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
                  <p className="text-green-800 font-medium">Wasiat Ditemukan!</p>
                  <p className="text-green-600 text-sm">
                    Wasiat berhasil ditemukan dan detail ditampilkan di bawah.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Will Details */}
          <WillCard
            will={will}
            userRole={userRole}
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
            <CardTitle className="text-blue-900 text-lg">💡 Tips Pencarian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-blue-800 min-w-0">
              <div className="flex items-start gap-2 min-w-0">
                <span className="shrink-0">•</span>
                <span className="flex-1 min-w-0 break-all">Alamat wasiat adalah Public Key dari akan wasiat (bukan vault)</span>
              </div>
              <div className="flex items-start gap-2 min-w-0">
                <span className="shrink-0">•</span>
                <span className="flex-1 min-w-0 break-all">Format alamat: 44 karakter base58 (contoh: 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM)</span>
              </div>
              <div className="flex items-start gap-2 min-w-0">
                <span className="shrink-0">•</span>
                <span className="flex-1 min-w-0 break-all">Jika tidak memiliki alamat, hubungi pewasiat atau cek dokumen warisan</span>
              </div>
              <div className="flex items-start gap-2 min-w-0">
                <span className="shrink-0">•</span>
                <span className="flex-1 min-w-0 break-all">Pastikan alamat yang dimasukkan adalah alamat wasiat, bukan alamat wallet</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
