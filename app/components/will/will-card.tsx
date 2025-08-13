import React from "react";
import { PublicKey } from "@solana/web3.js";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { CountdownTimer } from "../ui/countdown-timer";
import { StatusBadge } from "../ui/status-badge";
import { CopyButton } from "../ui/copy-button";
import { WillStatus } from "../../types/will";
import type { WillWithStatus } from "../../types/will";
import { formatSOL, formatAddress, formatDate } from "../../lib/utils/format";

interface WillCardProps {
  will: WillWithStatus;
  userRole: "testator" | "beneficiary" | "viewer";
  onDeposit?: () => void;
  onHeartbeat?: () => void;
  onWithdraw?: () => void;
  onClaim?: () => void;
  onViewDetails?: () => void;
}

export function WillCard({
  will,
  userRole,
  onDeposit,
  onHeartbeat,
  onWithdraw,
  onClaim,
  onViewDetails,
}: WillCardProps) {
  const getStatusColor = (status: WillStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case WillStatus.Created:
        return "secondary";
      case WillStatus.Active:
        return "default";
      case WillStatus.Triggered:
        return "outline";
      case WillStatus.Claimed:
        return "default";
      case WillStatus.Withdrawn:
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status: WillStatus) => {
    switch (status) {
      case WillStatus.Created:
        return "Dibuat";
      case WillStatus.Active:
        return "Aktif";
      case WillStatus.Triggered:
        return "Dipicu";
      case WillStatus.Claimed:
        return "Diklaim";
      case WillStatus.Withdrawn:
        return "Ditarik";
      default:
        return "Unknown";
    }
  };

  const renderActions = () => {
    if (userRole === "testator") {
      return (
        <div className="flex gap-2">
          {will.canHeartbeat && (
            <Button size="sm" onClick={onHeartbeat}>
              💓 Heartbeat
            </Button>
          )}
          {will.status === WillStatus.Created && (
            <Button size="sm" variant="outline" onClick={onDeposit}>
              💰 Deposit
            </Button>
          )}
          {will.canWithdraw && (
            <Button size="sm" variant="outline" onClick={onWithdraw}>
              📤 Tarik
            </Button>
          )}
        </div>
      );
    }

    if (userRole === "beneficiary") {
      return (
        <div className="flex gap-2">
          {will.canClaim && (
            <Button size="sm" onClick={onClaim}>
              🎯 Klaim Aset
            </Button>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="p-4 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold">Wasiat</h3>
            <StatusBadge 
              status={getStatusColor(will.status)} 
              text={getStatusText(will.status)} 
            />
          </div>
          <p className="text-sm text-gray-500">
            Dibuat: {formatDate(will.createdAt)}
          </p>
        </div>
        
        <div className="text-left sm:text-right w-full sm:w-auto">
          <p className="text-lg font-bold">{formatSOL(will.vaultBalance)} SOL</p>
          <p className="text-xs text-gray-500">Saldo Vault</p>
        </div>
      </div>

      {/* Participants */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span className="text-sm text-gray-600">Pewasiat:</span>
          <div className="flex items-center gap-1">
            <span className="text-sm font-mono break-all">
              {formatAddress(will.testator.toBase58())}
            </span>
            <CopyButton text={will.testator.toBase58()} size="sm" />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span className="text-sm text-gray-600">Penerima:</span>
          <div className="flex items-center gap-1">
            <span className="text-sm font-mono break-all">
              {formatAddress(will.beneficiary.toBase58())}
            </span>
            <CopyButton text={will.beneficiary.toBase58()} size="sm" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-2 border-t gap-2">
        <div className="flex gap-2 flex-wrap">
          {renderActions()}
        </div>
        
        <Button size="sm" variant="ghost" onClick={onViewDetails} className="w-full sm:w-auto">
          Detail →
        </Button>
      </div>
    </Card>
  );
}
