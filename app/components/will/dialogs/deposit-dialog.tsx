import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { DepositForm } from "../deposit-form";
import type { WillWithStatus } from "../../../types/will";
import { useNotification } from "../../../providers/notification-provider";
import { getExplorerUrl } from "../../../lib/solana/connection";

interface DepositDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  will: WillWithStatus;
  onSuccess?: () => void;
}

export function DepositDialog({ open, onOpenChange, will, onSuccess }: DepositDialogProps) {
  const notify = useNotification();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Aset (Deposit SOL)</DialogTitle>
        </DialogHeader>
        <DepositForm
          willAddress={will.address.toBase58()}
          onSuccess={(sig) => {
            onOpenChange(false);
            onSuccess?.();
              if (sig) {
                notify.showSuccess(
                  "Deposit berhasil",
                  <>
                    <a
                      href={getExplorerUrl(sig, "tx")}
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      {sig}
                    </a>
                  </>
                );
              } else {
                notify.showSuccess("Deposit berhasil", "Transaksi berhasil dikonfirmasi.");
              }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}


