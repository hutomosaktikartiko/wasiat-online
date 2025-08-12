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
    <Card className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
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
        
        <div className="text-right">
          <p className="text-lg font-bold">{formatSOL(will.vaultBalance)} SOL</p>
          <p className="text-xs text-gray-500">Saldo Vault</p>
        </div>
      </div>

      {/* Participants */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Pewasiat:</span>
          <div className="flex items-center gap-1">
            <span className="text-sm font-mono">
              {formatAddress(will.testator.toBase58())}
            </span>
            <CopyButton text={will.testator.toBase58()} size="sm" />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Penerima:</span>
          <div className="flex items-center gap-1">
            <span className="text-sm font-mono">
              {formatAddress(will.beneficiary.toBase58())}
            </span>
            <CopyButton text={will.beneficiary.toBase58()} size="sm" />
          </div>
        </div>
      </div>

      {/* Heartbeat Info */}
      {will.status === WillStatus.Active && (
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800">
              Status Heartbeat
            </span>
            <Badge variant={will.isExpired ? "destructive" : "default"}>
              {will.isExpired ? "Kedaluwarsa" : "Aktif"}
            </Badge>
          </div>
          
          {!will.isExpired ? (
            <CountdownTimer 
              targetTime={will.lastHeartbeat + will.heartbeatPeriod}
              onExpire={() => window.location.reload()}
            />
          ) : (
            <p className="text-sm text-red-600">
              Heartbeat telah kedaluwarsa. Wasiat dapat dipicu.
            </p>
          )}
          
          <p className="text-xs text-blue-600 mt-1">
            Heartbeat terakhir: {formatDate(will.lastHeartbeat)}
          </p>
        </div>
      )}

      {/* Triggered Status */}
      {will.status === WillStatus.Triggered && (
        <div className="bg-orange-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-orange-800 mb-1">
            🚨 Wasiat Telah Dipicu
          </p>
          <p className="text-xs text-orange-600">
            Dipicu pada: {will.triggerAt ? formatDate(will.triggerAt) : "Unknown"}
          </p>
          {userRole === "beneficiary" && (
            <p className="text-xs text-orange-600 mt-1">
              Anda dapat mengklaim aset sekarang.
            </p>
          )}
        </div>
      )}

      {/* Final Status */}
      {(will.status === WillStatus.Claimed || will.status === WillStatus.Withdrawn) && (
        <div className={`p-3 rounded-lg ${
          will.status === WillStatus.Claimed ? "bg-green-50" : "bg-gray-50"
        }`}>
          <p className={`text-sm font-medium mb-1 ${
            will.status === WillStatus.Claimed ? "text-green-800" : "text-gray-800"
          }`}>
            {will.status === WillStatus.Claimed ? "✅ Aset Telah Diklaim" : "📤 Aset Telah Ditarik"}
          </p>
          <p className={`text-xs ${
            will.status === WillStatus.Claimed ? "text-green-600" : "text-gray-600"
          }`}>
            Wasiat telah selesai.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t">
        {renderActions()}
        
        <Button size="sm" variant="ghost" onClick={onViewDetails}>
          Detail →
        </Button>
      </div>
    </Card>
  );
}
