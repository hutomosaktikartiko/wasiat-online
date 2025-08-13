import React, { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { EmptyState } from "../ui/empty-state";
import { LoadingSpinner } from "../ui/loading-spinner";
import { WillCard } from "./will-card";
import { WillStatus } from "../../types/will";
import type { WillWithStatus } from "../../types/will";
import { formatSOL } from "../../lib/utils/format";
import { useWallet } from "~/hooks/use-wallet";

interface WillListProps {
  wills: WillWithStatus[];
  isLoading?: boolean;
  error?: string | null;
  onCreateWill?: () => void;
  onWillAction?: (will: WillWithStatus, action: string) => void;
  showStats?: boolean;
  title?: string;
}

type FilterType = "all" | "created" | "active" | "triggered" | "claimed" | "withdrawn";
type SortType = "newest" | "oldest" | "balance-high" | "balance-low";

export function WillList({
  wills,
  isLoading = false,
  error = null,
  onCreateWill,
  onWillAction,
  showStats = true,
  title = "Your Wills"
}: WillListProps) {
  const { getUserRoleByWill } = useWallet();

  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("newest");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter wills
  const filteredWills = wills.filter(will => {
    // Status filter
    if (filter !== "all") {
      const statusMap: Record<FilterType, WillStatus | null> = {
        all: null,
        created: WillStatus.Created,
        active: WillStatus.Active,
        triggered: WillStatus.Triggered,
        claimed: WillStatus.Claimed,
        withdrawn: WillStatus.Withdrawn,
      };
      if (statusMap[filter] !== null && will.status !== statusMap[filter]) {
        return false;
      }
    }

    // Search filter (by beneficiary or testator address)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const testatorAddress = will.testator.toBase58().toLowerCase();
      const beneficiaryAddress = will.beneficiary.toBase58().toLowerCase();
      if (!testatorAddress.includes(searchLower) && !beneficiaryAddress.includes(searchLower)) {
        return false;
      }
    }

    return true;
  });

  // Sort wills
  const sortedWills = [...filteredWills].sort((a, b) => {
    switch (sort) {
      case "newest":
        return b.createdAt - a.createdAt;
      case "oldest":
        return a.createdAt - b.createdAt;
      case "balance-high":
        return b.vaultBalance - a.vaultBalance;
      case "balance-low":
        return a.vaultBalance - b.vaultBalance;
      default:
        return 0;
    }
  });

  // Calculate stats
  const stats = {
    total: wills.length,
    active: wills.filter(w => w.status === WillStatus.Active).length,
    totalValue: wills.reduce((sum, w) => sum + w.vaultBalance, 0),
    needsAttention: wills.filter(w => 
      w.canClaim || 
      (w.status === WillStatus.Active && w.isExpired) ||
      (w.status === WillStatus.Created && w.vaultBalance === 0)
    ).length,
  };

  const getStatusColor = (status: WillStatus) => {
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-4xl mb-4">❌</div>
            <p className="text-red-600">Error: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {showStats && wills.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Wasiat</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-sm text-muted-foreground">Aktif</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{formatSOL(stats.totalValue)}</div>
              <div className="text-sm text-muted-foreground">Total SOL</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">{stats.needsAttention}</div>
              <div className="text-sm text-muted-foreground">Perlu Perhatian</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-end items-start gap-4">
            <div>
              <CardTitle>{title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {wills.length === 0 
                  ? "Belum ada wasiat yang dibuat"
                  : `${sortedWills.length} dari ${wills.length} wasiat ditampilkan`
                }
              </p>
            </div>
            {onCreateWill && (
              <Button onClick={onCreateWill}>
                ➕ Buat Wasiat Baru
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {wills.length === 0 ? (
            <EmptyState
              icon="📋"
              title="Belum Ada Wasiat"
              description="Buat wasiat pertama Anda untuk mulai mengamankan warisan digital"
              action={onCreateWill ? {
                label: "Buat Wasiat Sekarang",
                onClick: onCreateWill,
              } : undefined}
            />
          ) : (
            <div className="space-y-4">
              {/* Filters and Search */}
              <div className="space-y-4">
                {/* Search */}
                <div className="w-full">
                  <Input
                    placeholder="Cari berdasarkan alamat..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                  {/* Status Filter */}
                  <div className="flex gap-1 flex-wrap">
                    {[
                      { key: "all", label: "Semua" },
                      { key: "created", label: "Dibuat" },
                      { key: "active", label: "Aktif" },
                      { key: "triggered", label: "Dipicu" },
                      { key: "claimed", label: "Diklaim" },
                      { key: "withdrawn", label: "Ditarik" },
                    ].map(({ key, label }) => (
                      <Button
                        key={key}
                        variant={filter === key ? "default" : "outline"}
                        size="sm"
                        className="text-xs px-2 py-1"
                        onClick={() => setFilter(key as FilterType)}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>

                  {/* Sort */}
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortType)}
                    className="px-3 py-2 border rounded-md text-sm min-w-0 sm:min-w-[140px]"
                  >
                    <option value="newest">Terbaru</option>
                    <option value="oldest">Terlama</option>
                    <option value="balance-high">Saldo Tertinggi</option>
                    <option value="balance-low">Saldo Terendah</option>
                  </select>
                </div>
              </div>

              {/* Will Cards */}
              {sortedWills.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="text-4xl mb-4">🔍</div>
                  <p>Tidak ada wasiat yang sesuai dengan filter</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {sortedWills.map((will) => (
                    <WillCard
                      key={will.address.toBase58()}
                      will={will}
                      userRole={getUserRoleByWill(will.testator, will.beneficiary)}
                      onDeposit={() => onWillAction?.(will, "deposit")}
                      onHeartbeat={() => onWillAction?.(will, "heartbeat")}
                      onWithdraw={() => onWillAction?.(will, "withdraw")}
                      onClaim={() => onWillAction?.(will, "claim")}
                      onViewDetails={() => onWillAction?.(will, "view")}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
