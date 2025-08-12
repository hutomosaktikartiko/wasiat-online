import React, { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { LoadingSpinner } from "../ui/loading-spinner";
import { useWill } from "../../hooks/use-will";
import { useProgram } from "../../providers/program-provider";
import { formatSOL, formatAddress } from "../../lib/utils/format";

interface ClaimButtonProps {
  will: any; // WillWithStatus type
  onSuccess?: () => void;
  className?: string;
}

export function ClaimButton({ will, onSuccess, className }: ClaimButtonProps) {
  const { claimSOL, transaction } = useWill();
  const { config } = useProgram();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClaim = async () => {
    const result = await claimSOL();
    
    if (result.success) {
      setIsDialogOpen(false);
      onSuccess?.();
    }
  };

  // Calculate fee and net amount
  const vaultBalance = will.vaultBalance;
  const feePercentage = config ? config.tokenFeeBps / 10000 : 0.05; // 5% default
  const feeAmount = vaultBalance * feePercentage;
  const netAmount = vaultBalance - feeAmount;

  if (!will.canClaim) {
    return null;
  }

  return (
    <div className={className}>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            size="lg" 
            className="w-full"
            disabled={transaction.isLoading}
          >
            {transaction.isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Memproses...
              </>
            ) : (
              <>
                🎯 Klaim Aset ({formatSOL(netAmount)} SOL)
              </>
            )}
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Konfirmasi Klaim Aset</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Will Info */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-medium text-orange-900 mb-2">
                🚨 Wasiat Telah Dipicu
              </h3>
              <p className="text-sm text-orange-800">
                Wasiat ini telah dipicu karena pewasiat tidak mengirim heartbeat 
                dalam periode yang ditentukan. Anda sekarang dapat mengklaim aset.
              </p>
            </div>

            {/* Claim Details */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Pewasiat:</span>
                <span className="text-sm font-mono">
                  {formatAddress(will.testator)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total di Vault:</span>
                <span className="text-sm font-medium">
                  {formatSOL(vaultBalance)} SOL
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Biaya Layanan ({(feePercentage * 100).toFixed(1)}%):</span>
                <span className="text-sm text-red-600">
                  -{formatSOL(feeAmount)} SOL
                </span>
              </div>
              
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-medium">Anda Terima:</span>
                <span className="font-bold text-green-600">
                  {formatSOL(netAmount)} SOL
                </span>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ <strong>Perhatian:</strong> Setelah diklaim, aset tidak dapat dikembalikan. 
                Pastikan Anda adalah penerima manfaat yang sah.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
                disabled={transaction.isLoading}
              >
                Batal
              </Button>
              <Button
                onClick={handleClaim}
                className="flex-1"
                disabled={transaction.isLoading}
              >
                {transaction.isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Mengklaim...
                  </>
                ) : (
                  "Klaim Sekarang"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transaction Status */}
      {transaction.signature && (
        <div className="bg-green-50 p-3 rounded-lg mt-4">
          <p className="text-sm text-green-800">
            ✅ Aset berhasil diklaim!
          </p>
          <p className="text-xs text-green-600 mt-1 break-all">
            Signature: {transaction.signature}
          </p>
        </div>
      )}

      {transaction.error && (
        <div className="bg-red-50 p-3 rounded-lg mt-4">
          <p className="text-sm text-red-800">
            ❌ {transaction.error}
          </p>
        </div>
      )}
    </div>
  );
}
