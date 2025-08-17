import type { Route } from "./+types/beneficiary";
import { useNavigate } from "react-router";
import { MainLayout } from "../../components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
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
    hasBeneficiaryWills
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
            <h1 className="text-2xl sm:text-3xl font-bold">Beneficiary Dashboard</h1>
            <p className="text-muted-foreground">
              Check will status and claim inheritance intended for you
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
                          <div className="text-sm text-muted-foreground">Wills for You</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-orange-600">{beneficiaryStats.triggered}</div>
                          <div className="text-sm text-muted-foreground">Triggered</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-green-600">{beneficiaryStats.claimable}</div>
                          <div className="text-sm text-muted-foreground">Claimable</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-blue-600">{formatSOL(beneficiaryStats.claimableValue)}</div>
                          <div className="text-sm text-muted-foreground">SOL Available</div>
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
                      title="Wills as Beneficiary"
                    />

                    {/* Claim Alert */}
                    {beneficiaryStats.claimable > 0 && (
                      <div className="mt-8">
                        <Card className="bg-green-50 border-green-200">
                          <CardHeader>
                            <CardTitle className="text-green-900 flex items-center gap-2">
                              🎯 Assets Available to Claim!
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-green-800 text-sm mb-4">
                              You have {beneficiaryStats.claimable} wills with total {formatSOL(beneficiaryStats.claimableValue)} SOL 
                              ready to claim. Click "Claim Assets" button on wills with "Triggered" status.
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
                                    Claim {formatSOL(will.vaultBalance)} SOL
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
                  <h3 className="text-xl font-semibold mb-2">Wallet Not Connected</h3>
                  <p className="text-muted-foreground">
                    Connect your wallet to view wills intended for you
                  </p>
                </CardContent>
              </Card>
            )}
          </ClientOnlyWallet>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6 md:mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📋 Will Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span><strong>Active:</strong> Testator still sending heartbeat</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                    <span><strong>Triggered:</strong> Ready to be claimed by beneficiary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                    <span><strong>Claimed:</strong> Already claimed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-gray-500"></span>
                    <span><strong>Withdrawn:</strong> Withdrawn back by testator</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">❓ Help</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <strong>Don't have will address?</strong>
                    <p className="text-muted-foreground">Contact testator or check inheritance documents</p>
                  </div>
                  <div>
                    <strong>How to claim assets?</strong>
                    <p className="text-muted-foreground">Connect wallet and click claim button after will is triggered</p>
                  </div>
                  <div>
                    <strong>Need help?</strong>
                    <p className="text-muted-foreground">
                      <a href="/support" className="text-primary hover:underline">
                        Contact support
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
