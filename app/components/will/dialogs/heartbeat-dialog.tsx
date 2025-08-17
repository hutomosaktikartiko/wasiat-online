import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import type { WillWithStatus } from "../../../types/will";
import { Button } from "../../ui/button";
import { LoadingSpinner } from "../../ui/loading-spinner";
import { useNotification } from "../../../providers/notification-provider";
import { getExplorerUrl } from "../../../lib/solana/connection";

interface HeartbeatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  will: WillWithStatus;
  onConfirm: () => Promise<{ success: boolean; signature?: string | null }>;
}

export function HeartbeatDialog({ open, onOpenChange, will, onConfirm }: HeartbeatDialogProps) {
  const [loading, setLoading] = React.useState(false);
  const [signature, setSignature] = React.useState<string | null>(null);
  const notify = useNotification();

  const handleConfirm = async () => {
    setLoading(true);
    const res = await onConfirm();
    setLoading(false);
    if (res.success) {
      setSignature(res.signature || null);
      onOpenChange(false);
      if (res.signature) {
        notify.showSuccess(
          "Heartbeat successful", 
          <>
            <a href={getExplorerUrl(res.signature, "tx")} target="_blank" rel="noreferrer" className="underline">
              {res.signature}
            </a>
          </>
        );
      } else {
        notify.showSuccess("Heartbeat successful", "Transaction confirmed successfully.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Send Heartbeat</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Send heartbeat to reset timer and keep will active.
          </p>
          <Button onClick={handleConfirm} disabled={loading} className="w-full">
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Sending...
              </>
            ) : (
              "Send Heartbeat"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


