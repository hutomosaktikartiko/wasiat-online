import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import type { WillWithStatus } from "../../../types/will";
import { Button } from "../../ui/button";
import { LoadingSpinner } from "../../ui/loading-spinner";
import { formatSOL } from "../../../lib/utils/format";
import { useNotification } from "../../../providers/notification-provider";
import { getExplorerUrl } from "../../../lib/solana/connection";

interface ClaimDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  will: WillWithStatus;
  onConfirm: () => Promise<{ success: boolean; signature?: string | null }>;
}

export function ClaimDialog({ open, onOpenChange, will, onConfirm }: ClaimDialogProps) {
  const [loading, setLoading] = React.useState(false);
  const notify = useNotification();

  const handleConfirm = async () => {
    setLoading(true);
    const res = await onConfirm();
    setLoading(false);
    if (res.success) {
      onOpenChange(false);
      if (res.signature) {
        notify.showSuccess(
          "Klaim berhasil", 
          <>
            <a href={getExplorerUrl(res.signature, "tx")} target="_blank" rel="noreferrer" className="underline">
              {res.signature}
            </a>
          </>
        );
      } else {
        notify.showSuccess("Klaim berhasil", "Transaksi berhasil dikonfirmasi.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Konfirmasi Klaim Aset</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Wasiat telah dipicu. Klaim seluruh aset ke wallet Anda.
          </p>
          <div className="text-sm">
            Total di Vault: <strong>{formatSOL(will.vaultBalance)} SOL</strong>
          </div>
          <Button onClick={handleConfirm} disabled={loading} className="w-full">
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Mengklaim...
              </>
            ) : (
              "Klaim Sekarang"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


