import React, { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { LoadingSpinner } from "../ui/loading-spinner";
import { useWill } from "../../hooks/use-will";
import { formatSOL, formatAddress } from "../../lib/utils/format";

interface WithdrawFormProps {
  will: any; // WillWithStatus type
  onSuccess?: () => void;
  className?: string;
}

export function WithdrawForm({ will, onSuccess, className }: WithdrawFormProps) {
  const { withdrawSOL, transaction } = useWill(undefined, undefined, will?.address);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleWithdraw = async () => {
    const result = await withdrawSOL();
    
    if (result.success) {
      setIsDialogOpen(false);
      onSuccess?.();
    }
  };

  if (!will.canWithdraw) {
    return null;
  }

  return (
    <div className={className}>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
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
                📤 Tarik Semua Aset ({formatSOL(will.vaultBalance)} SOL)
              </>
            )}
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Konfirmasi Penarikan Aset</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Withdraw Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">
                📤 Penarikan Aset Wasiat
              </h3>
              <p className="text-sm text-blue-800">
                Anda akan menarik semua aset dari vault wasiat ini. 
                Setelah ditarik, wasiat akan dibatalkan secara permanen.
              </p>
            </div>

            {/* Withdraw Details */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Penerima Manfaat:</span>
                <span className="text-sm font-mono">
                  {formatAddress(will.beneficiary.toBase58())}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total di Vault:</span>
                <span className="text-sm font-medium">
                  {formatSOL(will.vaultBalance)} SOL
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Biaya Transaksi:</span>
                <span className="text-sm text-gray-600">
                  ~0.001 SOL
                </span>
              </div>
              
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-medium">Anda Terima:</span>
                <span className="font-bold text-green-600">
                  {formatSOL(will.vaultBalance)} SOL
                </span>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-sm text-red-800">
                ⚠️ <strong>Perhatian:</strong> Penarikan ini akan:
              </p>
              <ul className="text-sm text-red-700 mt-1 list-disc list-inside space-y-1">
                <li>Membatalkan wasiat secara permanen</li>
                <li>Mengembalikan semua aset ke wallet Anda</li>
                <li>Tidak dapat dibatalkan setelah transaksi dikonfirmasi</li>
              </ul>
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
                onClick={handleWithdraw}
                variant="destructive"
                className="flex-1"
                disabled={transaction.isLoading}
              >
                {transaction.isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Menarik...
                  </>
                ) : (
                  "Tarik Sekarang"
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
            ✅ Aset berhasil ditarik!
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
