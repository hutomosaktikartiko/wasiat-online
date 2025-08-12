import type { Route } from "./+types/testator";
import { useNavigate } from "react-router";
import { MainLayout } from "../../components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ClientOnlyWallet } from "../../components/wallet/client-only-wallet";
import { WillList } from "../../components/will/will-list";
import { useWallet } from "../../hooks/use-wallet";
import { useWills } from "../../hooks/use-wills";
import { formatSOL } from "../../lib/utils/format";
import { WillStatus } from "../../types/will";
import type { WillWithStatus } from "../../types/will";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard Pewasiat — Wasiat Online" },
    { name: "description", content: "Kelola wasiat dan monitor aset inheritance Anda" },
  ];
}

export default function TestatorDashboard() {
  const navigate = useNavigate();
  const wallet = useWallet();
  const { 
    testatorWills, 
    stats, 
    isLoading, 
    error,
    hasTestatorWills,
    getWillsNeedingAttention 
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
        navigate(`/will/${will.address.toBase58()}`);
        break;
      default:
        console.log(`Action ${action} for will:`, will.address.toBase58());
    }
  };

  // Calculate testator-specific stats
  const testatorStats = {
    total: testatorWills.length,
    active: testatorWills.filter(w => w.status === WillStatus.Active).length,
    created: testatorWills.filter(w => w.status === WillStatus.Created).length,
    totalValue: testatorWills.reduce((sum, w) => sum + w.vaultBalance, 0),
    needingAttention: getWillsNeedingAttention().filter(w => 
      w.testator.equals(wallet.publicKey!)
    ).length,
  };

  return (
    <MainLayout>
      <div className="py-4 sm:py-8 px-4">
        <div className="container max-w-7xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Dashboard Pewasiat</h1>
              <p className="text-muted-foreground">
                Kelola wasiat dan monitor status inheritance Anda
              </p>
            </div>
            <ClientOnlyWallet>
              {wallet.isConnected && (
                <Button className="mt-4 sm:mt-0" onClick={handleCreateWill}>
                  ➕ Buat Wasiat Baru
                </Button>
              )}
            </ClientOnlyWallet>
          </div>

          <ClientOnlyWallet>
            {wallet.isConnected ? (
              <>
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-primary">{testatorStats.total}</div>
                      <div className="text-sm text-muted-foreground">Total Wasiat</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-green-600">{testatorStats.active}</div>
                      <div className="text-sm text-muted-foreground">Aktif</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-blue-600">{formatSOL(testatorStats.totalValue)}</div>
                      <div className="text-sm text-muted-foreground">Total SOL</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-orange-600">{testatorStats.needingAttention}</div>
                      <div className="text-sm text-muted-foreground">Perlu Perhatian</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Wills List */}
                <WillList
                  wills={testatorWills}
                  isLoading={isLoading}
                  error={error}
                  userRole="testator"
                  onCreateWill={handleCreateWill}
                  onWillAction={handleWillAction}
                  showStats={false} // Stats sudah ditampilkan di atas
                  title="Wasiat Sebagai Pewasiat"
                />

                {/* Quick Actions - only show if user has wills */}
                {hasTestatorWills && (
                  <div className="mt-8">
                    <Card className="p-6 bg-primary/5">
                      <CardHeader>
                        <CardTitle className="text-xl">🚀 Aksi Cepat</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                          <Button 
                            variant="outline" 
                            className="h-auto flex-col py-4"
                            onClick={handleCreateWill}
                          >
                            <div className="text-2xl mb-2">📝</div>
                            <div>Buat Wasiat Baru</div>
                          </Button>
                          <Button 
                            variant="outline" 
                            className="h-auto flex-col py-4"
                            onClick={() => {
                              // Find first active will that can send heartbeat
                              const activeWill = testatorWills.find(w => w.canHeartbeat);
                              if (activeWill) {
                                navigate(`/will/${activeWill.address.toBase58()}`);
                              }
                            }}
                            disabled={!testatorWills.some(w => w.canHeartbeat)}
                          >
                            <div className="text-2xl mb-2">💓</div>
                            <div>Kirim Heartbeat</div>
                          </Button>
                          <Button 
                            variant="outline" 
                            className="h-auto flex-col py-4"
                            onClick={() => {
                              // Find first will that can receive deposits
                              const willForDeposit = testatorWills.find(w => 
                                w.status === WillStatus.Created || w.status === WillStatus.Active
                              );
                              if (willForDeposit) {
                                navigate(`/will/${willForDeposit.address.toBase58()}`);
                              }
                            }}
                            disabled={!testatorWills.some(w => 
                              w.status === WillStatus.Created || w.status === WillStatus.Active
                            )}
                          >
                            <div className="text-2xl mb-2">💰</div>
                            <div>Tambah Aset</div>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-4xl mb-4">🔒</div>
                  <h3 className="text-xl font-semibold mb-2">Wallet Belum Terhubung</h3>
                  <p className="text-muted-foreground">
                    Hubungkan wallet Anda untuk melihat dan mengelola wasiat sebagai pewasiat
                  </p>
                </CardContent>
              </Card>
            )}
          </ClientOnlyWallet>
        </div>
      </div>
    </MainLayout>
  );
}
