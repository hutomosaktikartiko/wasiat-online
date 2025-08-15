import { Badge } from "./badge";
import { cn } from "../../lib/utils";

export type WillStatus = "created" | "active" | "triggered" | "claimed" | "withdrawn";
export type TransactionStatus = "pending" | "success" | "failed" | "cancelled";

interface StatusBadgeProps {
  status: "default" | "secondary" | "destructive" | "outline";
  text: string;
  className?: string;
}

export function StatusBadge({ status, text, className }: StatusBadgeProps) {
  return (
    <Badge variant={status} className={className}>
      {text}
    </Badge>
  );
}

// Convenience components
export function WillStatusBadge({ status, className }: { status: WillStatus; className?: string }) {
  const getStatusProps = (status: WillStatus) => {
    switch (status) {
      case "created":
        return { status: "secondary" as const, text: "Dibuat" };
      case "active":
        return { status: "default" as const, text: "Aktif" };
      case "triggered":
        return { status: "outline" as const, text: "Dipicu" };
      case "claimed":
        return { status: "default" as const, text: "Diklaim" };
      case "withdrawn":
        return { status: "destructive" as const, text: "Ditarik" };
      default:
        return { status: "secondary" as const, text: "Unknown" };
    }
  };

  const props = getStatusProps(status);
  return <StatusBadge status={props.status} text={props.text} className={className} />;
}

export function TransactionStatusBadge({ status, className }: { status: TransactionStatus; className?: string }) {
  const getStatusProps = (status: TransactionStatus) => {
    switch (status) {
      case "pending":
        return { status: "outline" as const, text: "Menunggu" };
      case "success":
        return { status: "default" as const, text: "Berhasil" };
      case "failed":
        return { status: "destructive" as const, text: "Gagal" };
      case "cancelled":
        return { status: "secondary" as const, text: "Dibatalkan" };
      default:
        return { status: "secondary" as const, text: "Unknown" };
    }
  };

  const props = getStatusProps(status);
  return <StatusBadge status={props.status} text={props.text} className={className} />;
}
