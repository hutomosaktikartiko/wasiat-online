import type { Route } from "./+types/beneficiary";
import { useNavigate } from "react-router";
import { MainLayout } from "../../components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ClientOnlyWallet } from "../../components/wallet/client-only-wallet";
import { WillList } from "../../components/will/will-list";
import { WillSearch } from "../../components/will/will-search";
import { useWallet } from "../../hooks/use-wallet";
import { useWills } from "../../hooks/use-wills";
import { formatSOL } from "../../lib/utils/format";
import { WillStatus } from "../../types/will";
import type { WillWithStatus } from "../../types/will";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard Beneficiary — Wasiat Online" },
    { name: "description", content: "Cek status wasiat dan klaim warisan yang ditujukan untuk Anda" },
  ];
}

export default function BeneficiaryDashboard() {
  const navigate = useNavigate();
  const wallet = useWallet();
  const willsData = useWills();
  const { 
    beneficiaryWills, 
    stats, 
    isLoading, 
    error,
    hasBeneficiaryWills,
    getWillsNeedingAttention 
  } = willsData;

  const handleWillAction = (will: WillWithStatus, action: string) => {
    switch (action) {
      case "view":
      case "claim":
        navigate(`/will/${will.address.toBase58()}`);
        break;
      default:
        console.log(`Action ${action} for will:`, will.address.toBase58());
    }
  };

  const handleWillFound = (will: WillWithStatus) => {
    // Optional: Do something when will is found via search
    console.log("Will found:", will.address.toBase58());
  };

  // Calculate beneficiary-specific stats
  const beneficiaryStats = {
    total: beneficiaryWills.length,
    triggered: beneficiaryWills.filter(w => w.status === WillStatus.Triggered).length,
    claimable: beneficiaryWills.filter(w => w.canClaim).length,
    totalValue: beneficiaryWills.reduce((sum, w) => sum + w.vaultBalance, 0),
    claimableValue: beneficiaryWills
      .filter(w => w.canClaim)
      .reduce((sum, w) => sum + w.vaultBalance, 0),
  };

  return (
    <MainLayout>
      <div className="py-4 sm:py-8 px-4">
        <div className="container max-w-7xl">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold">Dashboard Penerima Manfaat</h1>
            <p className="text-muted-foreground">
              Cek status wasiat dan klaim warisan yang ditujukan untuk Anda
            </p>
          </div>

          {/* Search Section */}
          <div className="mb-8">
            <WillSearch 
              onWillFound={handleWillFound}
              onWillAction={handleWillAction}
            />
          </div>

          <ClientOnlyWallet>
            {wallet.isConnected ? (
              <>
                {hasBeneficiaryWills ? (
                  <>
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-primary">{beneficiaryStats.total}</div>
                          <div className="text-sm text-muted-foreground">Wasiat untuk Anda</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-orange-600">{beneficiaryStats.triggered}</div>
                          <div className="text-sm text-muted-foreground">Dipicu</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-green-600">{beneficiaryStats.claimable}</div>
                          <div className="text-sm text-muted-foreground">Bisa Diklaim</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-blue-600">{formatSOL(beneficiaryStats.claimableValue)}</div>
                          <div className="text-sm text-muted-foreground">SOL Tersedia</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Wills List */}
                    <WillList
                      wills={beneficiaryWills}
                      isLoading={isLoading}
                      error={error}
                      onWillAction={handleWillAction}
                      showStats={false} // Stats sudah ditampilkan di atas
                      title="Wasiat Sebagai Penerima Manfaat"
                    />

                    {/* Claim Alert */}
                    {beneficiaryStats.claimable > 0 && (
                      <div className="mt-8">
                        <Card className="bg-green-50 border-green-200">
                          <CardHeader>
                            <CardTitle className="text-green-900 flex items-center gap-2">
                              🎯 Ada Aset yang Bisa Diklaim!
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-green-800 text-sm mb-4">
                              Anda memiliki {beneficiaryStats.claimable} wasiat dengan total {formatSOL(beneficiaryStats.claimableValue)} SOL 
                              yang siap diklaim. Klik tombol "Klaim Aset" pada wasiat yang berstatus "Dipicu".
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2">
                              {beneficiaryWills
                                .filter(w => w.canClaim)
                                .slice(0, 3) // Show max 3 claimable wills
                                .map((will) => (
                                  <Button 
                                    key={will.address.toBase58()}
                                    size="sm"
                                    className="w-full sm:w-auto"
                                    onClick={() => handleWillAction(will, "claim")}
                                  >
                                    Klaim {formatSOL(will.vaultBalance)} SOL
                                  </Button>
                                ))
                              }
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </>
                ) : null}
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-4xl mb-4">🔒</div>
                  <h3 className="text-xl font-semibold mb-2">Wallet Belum Terhubung</h3>
                  <p className="text-muted-foreground">
                    Hubungkan wallet Anda untuk melihat wasiat yang ditujukan untuk Anda
                  </p>
                </CardContent>
              </Card>
            )}
          </ClientOnlyWallet>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6 md:mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📋 Status Wasiat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span><strong>Aktif:</strong> Pewasiat masih mengirim heartbeat</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                    <span><strong>Triggered:</strong> Siap diklaim oleh beneficiary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                    <span><strong>Claimed:</strong> Sudah diklaim</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-gray-500"></span>
                    <span><strong>Withdrawn:</strong> Ditarik kembali pewasiat</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">❓ Bantuan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <strong>Tidak punya alamat wasiat?</strong>
                    <p className="text-muted-foreground">Hubungi pewasiat atau cek dokumen warisan</p>
                  </div>
                  <div>
                    <strong>Cara mengklaim aset?</strong>
                    <p className="text-muted-foreground">Connect wallet dan klik tombol claim setelah wasiat triggered</p>
                  </div>
                  <div>
                    <strong>Butuh bantuan?</strong>
                    <p className="text-muted-foreground">
                      <a href="/support" className="text-primary hover:underline">
                        Hubungi support
                      </a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
