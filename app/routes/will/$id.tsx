import type { Route } from "./+types/$id";
import { MainLayout } from "../../components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { StatusBadge } from "../../components/ui/status-badge";
import { CopyAddress } from "../../components/ui/copy-button";
import { CountdownTimer } from "../../components/ui/countdown-timer";
import { useEffect, useMemo, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { useWill } from "../../hooks/use-will";
import { formatDate, formatSOL } from "../../lib/utils/format";
import { TxHistory } from "../../components/transaction/tx-history";
import { DepositDialog } from "../../components/will/dialogs/deposit-dialog";
import { HeartbeatDialog } from "../../components/will/dialogs/heartbeat-dialog";
import { WithdrawDialog } from "../../components/will/dialogs/withdraw-dialog";
import { ClaimDialog } from "../../components/will/dialogs/claim-dialog";
import { WillStatus } from "../../types/will";
import { useWallet } from "~/hooks/use-wallet";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Will ${params.id} — Wasiat Online` },
    { name: "description", content: "Detail wasiat dan manajemen aset" },
  ];
}

export default function WillDetail({ params }: Route.ComponentProps) {
  const willId = params.id;
  const willPubkey = useMemo(() => {
    try { return new PublicKey(willId); } catch { return null; }
  }, [willId]);
  const { will, isLoading, error, fetchWill, sendHeartbeat, withdrawSOL, claimSOL } = useWill(
    undefined,
    undefined,
    willPubkey ?? undefined
  );

  const { getUserRoleByWill } = useWallet();

  // Dialog states
  const [depositOpen, setDepositOpen] = useState(false);
  const [heartbeatOpen, setHeartbeatOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [claimOpen, setClaimOpen] = useState(false);

  useEffect(() => {
    if (!willPubkey) return;
    fetchWill();
  }, [willPubkey]);

  return (
    <MainLayout>
      <div className="py-8 px-4">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold">Will Details</h1>
              <p className="text-muted-foreground">ID: {willId}</p>
            </div>
            <StatusBadge 
              status={
                !will ? "secondary" : will.status === 0 ? "secondary" : will.status === 1 ? "default" : will.status === 2 ? "outline" : will.status === 3 ? "default" : "destructive"
              }
              text={!will ? "Loading" : will.status === 0 ? "Created" : will.status === 1 ? "Active" : will.status === 2 ? "Triggered" : will.status === 3 ? "Claimed" : "Withdrawn"}
            />
          </div>

          {/* Loading / Error */}
          {isLoading && (
            <div className="text-center text-sm text-muted-foreground mb-6">Loading will data...</div>
          )}
          {error && (
            <div className="text-center text-sm text-red-600 mb-6">{error}</div>
          )}

          {/* Will Info */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>📋 Will Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {will ? (
                  <>
                    <div>
                      <label className="text-sm font-semibold">Testator</label>
                      <CopyAddress address={will.testator.toBase58()} />
                    </div>
                    <div>
                      <label className="text-sm font-semibold">Beneficiary</label>
                      <CopyAddress address={will.beneficiary.toBase58()} />
                    </div>
                    <div>
                      <label className="text-sm font-semibold">Vault Address</label>
                      <CopyAddress address={will.vault.toBase58()} />
                    </div>
                    <div>
                      <label className="text-sm font-semibold">Vault Balance</label>
                      <p className="text-sm font-medium">{formatSOL(will.vaultBalance)} SOL</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold">Created</label>
                      <p className="text-sm">{new Date(will.createdAt * 1000).toLocaleString('id-ID')}</p>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Will data not available yet.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>💓 Heartbeat Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {will ? (
                  <>
                    <div>
                      <label className="text-sm font-semibold">Heartbeat Period</label>
                      <p className="text-sm">{Math.floor(will.heartbeatPeriod / (24*60*60))} days</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold">Last Heartbeat</label>
                      <p className="text-sm">{formatDate(will.lastHeartbeat)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold">Time Remaining</label>
                      <CountdownTimer targetTime={will.lastHeartbeat + will.heartbeatPeriod} size="sm" />
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">—</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          {will &&
            (getUserRoleByWill(will.testator, will.beneficiary) === "testator" ||
            getUserRoleByWill(will.testator, will.beneficiary) === "beneficiary") && (
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">⚡ Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    {/* Deposit */}
                    {getUserRoleByWill(will.testator, will.beneficiary) === "testator" && (
                      <>
                        <Button
                          variant="outline"
                          className="h-auto flex-col py-4"
                          onClick={() => setDepositOpen(true)}
                          disabled={!(will.status === WillStatus.Created || will.status === WillStatus.Active)}
                        >
                          <div className="text-2xl mb-2">💰</div>
                          <div>Add Assets</div>
                        </Button>
                        <DepositDialog
                          open={depositOpen}
                          onOpenChange={(v) => setDepositOpen(v)}
                          will={will}
                          onSuccess={() => fetchWill()}
                        />
                      </>
                    )}
                    {/* Heartbeat */}
                    {getUserRoleByWill(will.testator, will.beneficiary) === "testator" && (
                      <>
                        <Button
                          variant="outline"
                          className="h-auto flex-col py-4"
                          onClick={() => setHeartbeatOpen(true)}
                          disabled={!will.canHeartbeat}
                        >
                          <div className="text-2xl mb-2">💓</div>
                          <div>Send Heartbeat</div>
                        </Button>
                        <HeartbeatDialog
                          open={heartbeatOpen}
                          onOpenChange={(v) => setHeartbeatOpen(v)}
                          will={will}
                          onConfirm={sendHeartbeat}
                        />
                      </>
                    )}

                    {/* Withdraw */}
                    {getUserRoleByWill(will.testator, will.beneficiary) === "testator" && (
                      <>
                        <Button
                          variant="outline"
                          className="h-auto flex-col py-4"
                          onClick={() => setWithdrawOpen(true)}
                          disabled={!will.canWithdraw}
                        >
                          <div className="text-2xl mb-2">💸</div>
                          <div>Withdraw Assets</div>
                        </Button>
                        <WithdrawDialog
                          open={withdrawOpen}
                          onOpenChange={(v) => setWithdrawOpen(v)}
                          will={will}
                          onConfirm={withdrawSOL}
                        />
                      </>
                    )}

                    {/* Claim */}
                    {getUserRoleByWill(will.testator, will.beneficiary) === "beneficiary" && (
                      <>
                        <Button
                          variant="outline"
                          className="h-auto flex-col py-4"
                          onClick={() => setClaimOpen(true)}
                          disabled={!will.canClaim}
                        >
                        <div className="text-2xl mb-2">🎯</div>
                        <div>Claim Assets</div>
                        </Button>
                        <ClaimDialog
                          open={claimOpen}
                          onOpenChange={(v) => setClaimOpen(v)}
                          will={will}
                          onConfirm={claimSOL}
                        />
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Transaction History */}
          {will && (
            <div className="mt-8">
              <TxHistory willAddress={will.address} />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
