import React from "react";
import { Badge } from "./badge";
import { cn } from "../../lib/utils";

export type WillStatus = "created" | "active" | "triggered" | "claimed" | "withdrawn";
export type TransactionStatus = "pending" | "success" | "failed" | "cancelled";

interface StatusBadgeProps {
  status: WillStatus | TransactionStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = (status: WillStatus | TransactionStatus) => {
    switch (status) {
      // Will statuses
      case "created":
        return {
          label: "Dibuat",
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: "📝"
        };
      case "active":
        return {
          label: "Aktif", 
          color: "bg-green-100 text-green-800 border-green-200",
          icon: "✅"
        };
      case "triggered":
        return {
          label: "Dipicu",
          color: "bg-orange-100 text-orange-800 border-orange-200",
          icon: "⚡"
        };
      case "claimed":
        return {
          label: "Diklaim",
          color: "bg-purple-100 text-purple-800 border-purple-200", 
          icon: "🎯"
        };
      case "withdrawn":
        return {
          label: "Ditarik",
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: "↩️"
        };
      
      // Transaction statuses
      case "pending":
        return {
          label: "Menunggu",
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: "⏳"
        };
      case "success":
        return {
          label: "Berhasil",
          color: "bg-green-100 text-green-800 border-green-200",
          icon: "✅"
        };
      case "failed":
        return {
          label: "Gagal",
          color: "bg-red-100 text-red-800 border-red-200",
          icon: "❌"
        };
      case "cancelled":
        return {
          label: "Dibatalkan",
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: "🚫"
        };
      
      default:
        return {
          label: "Unknown",
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: "❓"
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge className={cn(config.color, "gap-1", className)}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </Badge>
  );
}

// Convenience components
export function WillStatusBadge({ status, className }: { status: WillStatus; className?: string }) {
  return <StatusBadge status={status} className={className} />;
}

export function TransactionStatusBadge({ status, className }: { status: TransactionStatus; className?: string }) {
  return <StatusBadge status={status} className={className} />;
}
