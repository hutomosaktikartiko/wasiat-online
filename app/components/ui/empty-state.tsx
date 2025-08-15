import { Button } from "./button";
import { cn } from "../../lib/utils";
import { useNavigate } from "react-router";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon = "📭",
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn("text-center py-12", className)}>
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Pre-built empty states
export function EmptyWills() {
  const navigate = useNavigate();
  
  return (
    <EmptyState
      icon="📋"
      title="Belum ada wasiat"
      description="Anda belum membuat wasiat apapun. Mulai dengan membuat wasiat pertama Anda untuk mengamankan warisan digital."
      action={{
        label: "Buat Wasiat Pertama",
        onClick: () => navigate("/will/create")
      }}
    />
  );
}

export function EmptyTransactions() {
  return (
    <EmptyState
      icon="📄"
      title="Belum ada transaksi"
      description="Riwayat transaksi Anda akan muncul di sini setelah Anda melakukan aktivitas di platform."
    />
  );
}
