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

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard — Wasiat Online" },
    { name: "description", content: "Manage your crypto inheritance wills and monitor your wallet status" },
  ];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const wallet = useWallet();
  const { 
    wills, 
    testatorWills, 
    beneficiaryWills, 
    stats, 
    isLoading, 
    error,
    hasWills,
    hasTestatorWills,
    hasBeneficiaryWills 
  } = useWills();

  const handleCreateWill = () => {
    navigate("/will/create");
  };

  const handleWillAction = (will: WillWithStatus, action: string) => {
    switch (action) {
      case "view":
        navigate(`/will/${will.address.toBase58()}`);
        break;
      case "deposit":
      case "heartbeat":
      case "withdraw":
      case "claim":
        navigate(`/will/${will.address.toBase58()}`);
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
              Kelola wasiat dan monitor status wallet Anda
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Wallet Status */}
            <div className="lg:col-span-1 space-y-4 lg:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Status Wallet</CardTitle>
                </CardHeader>
                <CardContent>
                  <ClientOnlyWallet>
                    {wallet.isConnected ? (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-4xl mb-2">✅</div>
                          <p className="font-medium text-green-600">Wallet Terhubung</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Alamat:</span>
                            <span className="text-sm font-mono">
                              {formatAddress(wallet.publicKey?.toBase58() || "")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Saldo:</span>
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
                            <h4 className="font-medium">Ringkasan Wasiat</h4>
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>Total Wasiat:</span>
                                <Badge variant="outline">{stats.totalWills}</Badge>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Aktif:</span>
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
                        <p>Wallet belum terhubung</p>
                        <p className="text-sm">Hubungkan wallet untuk melihat wasiat Anda</p>
                      </div>
                    )}
                  </ClientOnlyWallet>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              {wallet.isConnected && (
                <Card>
                  <CardHeader>
                    <CardTitle>Aksi Cepat</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={handleCreateWill}
                    >
                      ➕ Buat Wasiat Baru
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => navigate("/dashboard/testator")}
                    >
                      📊 Dashboard Pewasiat
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => navigate("/dashboard/beneficiary")}
                    >
                      🎯 Dashboard Penerima
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
                    userRole="testator" // Default role, bisa berubah berdasarkan context
                    onCreateWill={handleCreateWill}
                    onWillAction={handleWillAction}
                    showStats={false} // Stats sudah ditampilkan di sidebar
                    title="Semua Wasiat Anda"
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Wasiat Anda</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-muted-foreground">
                        <div className="text-4xl mb-4">📋</div>
                        <p>Hubungkan wallet untuk melihat wasiat</p>
                        <p className="text-sm">Anda perlu menghubungkan wallet terlebih dahulu</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </ClientOnlyWallet>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
