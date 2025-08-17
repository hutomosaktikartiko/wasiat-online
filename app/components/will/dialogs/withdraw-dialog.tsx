import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import type { WillWithStatus } from "../../../types/will";
import { Button } from "../../ui/button";
import { LoadingSpinner } from "../../ui/loading-spinner";
import { formatSOL } from "../../../lib/utils/format";
import { useNotification } from "../../../providers/notification-provider";
import { getExplorerUrl } from "../../../lib/solana/connection";

interface WithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  will: WillWithStatus;
  onConfirm: () => Promise<{ success: boolean; signature?: string | null }>;
}

export function WithdrawDialog({ open, onOpenChange, will, onConfirm }: WithdrawDialogProps) {
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
          "Withdrawal successful",
          <>
            <a href={getExplorerUrl(res.signature, "tx")} target="_blank" rel="noreferrer" className="underline">
              {res.signature}
            </a>
          </>
        );
      } else {
        notify.showSuccess("Withdrawal successful", "Transaction confirmed successfully.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Asset Withdrawal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You will withdraw all assets from vault and cancel the will.
          </p>
          <div className="text-sm">
            Total di Vault: <strong>{formatSOL(will.vaultBalance)} SOL</strong>
          </div>
          <Button variant="destructive" onClick={handleConfirm} disabled={loading} className="w-full">
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Withdrawing...
              </>
            ) : (
              "Withdraw Now"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


