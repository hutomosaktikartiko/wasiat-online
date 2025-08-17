import type { Route } from "./+types/dashboard";
import { useNavigate } from "react-router";
import { MainLayout } from "../components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { LoadingSpinner } from "../components/ui/loading-spinner";
import { ClientOnlyWallet } from "../components/wallet/client-only-wallet";
import { WillList } from "../components/will/will-list";
import { useWallet } from "../hooks/use-wallet";
import { useWills } from "../hooks/use-wills";
import { formatSOL, formatAddress } from "../lib/utils/format";
import type { WillWithStatus } from "../types/will";
import { useState } from "react";
import { DepositDialog } from "~/components/will/dialogs/deposit-dialog";
import { HeartbeatDialog } from "~/components/will/dialogs/heartbeat-dialog";
import { useWill } from "~/hooks/use-will";
import { WithdrawDialog } from "~/components/will/dialogs/withdraw-dialog";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard — Wasiat Online" },
    { name: "description", content: "Manage your crypto inheritance wills and monitor your wallet status" },
  ];
}

export default function Dashboard() {
  // Dialog states
  const [selectedWill, setSelectedWill] = useState<WillWithStatus | null>(null);
  const [depositOpen, setDepositOpen] = useState(false);
  const [heartbeatOpen, setHeartbeatOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [claimOpen, setClaimOpen] = useState(false);

  const navigate = useNavigate();
  const wallet = useWallet();
  const { 
    wills, 
    stats, 
    isLoading, 
    error,
    hasWills,
    fetchWills,
  } = useWills();
  const { sendHeartbeat, withdrawSOL, claimSOL } = useWill(
    undefined,
    undefined,
    selectedWill?.address ?? undefined
  );

  const handleCreateWill = () => {
    navigate("/will/create");
  };

  const handleWillAction = (will: WillWithStatus, action: string) => {
    switch (action) {
      case "view":
        navigate(`/will/${will.address.toBase58()}`);
        break;
      case "deposit":
        setSelectedWill(will);
        setDepositOpen(true);
        break;
      case "heartbeat":
        setSelectedWill(will);
        setHeartbeatOpen(true);
        break;
      case "withdraw":
        setSelectedWill(will);
        setWithdrawOpen(true);
        break;
      case "claim":
        setSelectedWill(will);
        setClaimOpen(true);
        break;
      default:
        console.log(`Action ${action} for will:`, will.address.toBase58());
    }
  };

  return (
    <MainLayout>
      <div className="py-4 sm:py-8 px-4">
        <div className="container max-w-7xl">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your wills and monitor your wallet status
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Wallet Status */}
            <div className="lg:col-span-1 space-y-4 lg:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Wallet Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <ClientOnlyWallet>
                    {wallet.isConnected ? (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-4xl mb-2">✅</div>
                          <p className="font-medium text-green-600">Wallet Connected</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Address:</span>
                            <span className="text-sm font-mono">
                              {formatAddress(wallet.publicKey?.toBase58() || "")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Balance:</span>
                            <span className="text-sm font-bold">
                              {wallet.isLoading ? (
                                <LoadingSpinner size="sm" />
                              ) : (
                                `${formatSOL(wallet.balance)} SOL`
                              )}
                            </span>
                          </div>
                        </div>

                        {hasWills && (
                          <div className="pt-4 border-t space-y-2">
                            <h4 className="font-medium">Will Summary</h4>
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>Total Wills:</span>
                                <Badge variant="outline">{stats.totalWills}</Badge>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Active:</span>
                                <Badge variant="default">{stats.activeWills}</Badge>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Total Value:</span>
                                <span className="font-bold">{formatSOL(stats.totalSOLValue)} SOL</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <div className="text-4xl mb-4">🔒</div>
                        <p>Wallet not connected</p>
                        <p className="text-sm">Connect your wallet to view your wills</p>
                      </div>
                    )}
                  </ClientOnlyWallet>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              {wallet.isConnected && (
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={handleCreateWill}
                    >
                      ➕ Create New Will
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => navigate("/dashboard/testator")}
                    >
                      📊 Testator Dashboard
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => navigate("/dashboard/beneficiary")}
                    >
                      🎯 Beneficiary Dashboard
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Wills Overview */}
            <div className="lg:col-span-2">
              <ClientOnlyWallet>
                {wallet.isConnected ? (
                  <WillList
                    wills={wills}
                    isLoading={isLoading}
                    error={error}
                    onCreateWill={handleCreateWill}
                    onWillAction={handleWillAction}
                    showStats={false} // Stats sudah ditampilkan di sidebar
                    title="All Your Wills"
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Wills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-muted-foreground">
                        <div className="text-4xl mb-4">📋</div>
                        <p>Connect wallet to view wills</p>
                        <p className="text-sm">You need to connect your wallet first</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </ClientOnlyWallet>
            </div>
            {selectedWill && (
              <DepositDialog
                open={depositOpen}
                onOpenChange={(v) => setDepositOpen(v)}
                will={selectedWill}
                onSuccess={() => fetchWills()}
              />
            )}

            {selectedWill && (
              <HeartbeatDialog
                open={heartbeatOpen}
                onOpenChange={(v) => setHeartbeatOpen(v)}
                will={selectedWill}
                onConfirm={sendHeartbeat}
              />
            )}

            {selectedWill && (
              <WithdrawDialog
                open={withdrawOpen}
                onOpenChange={(v) => setWithdrawOpen(v)}
                will={selectedWill}
                onConfirm={withdrawSOL}
              />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
