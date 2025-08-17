import type { Route } from "./+types/testator";
import { useNavigate } from "react-router";
import { MainLayout } from "../../components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { ClientOnlyWallet } from "../../components/wallet/client-only-wallet";
import { WillList } from "../../components/will/will-list";
import { useWallet } from "../../hooks/use-wallet";
import { useWills } from "../../hooks/use-wills";
import { formatSOL } from "../../lib/utils/format";
import { WillStatus } from "../../types/will";
import type { WillWithStatus } from "../../types/will";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Testator Dashboard — Wasiat Online" },
    { name: "description", content: "Manage your wills and monitor inheritance assets" },
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
              <h1 className="text-2xl sm:text-3xl font-bold">Testator Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your wills and monitor inheritance status
              </p>
            </div>
            <ClientOnlyWallet>
              {wallet.isConnected && (
                <Button className="mt-4 sm:mt-0" onClick={handleCreateWill}>
                  ➕ Create New Will
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
                      <div className="text-sm text-muted-foreground">Total Wills</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-green-600">{testatorStats.active}</div>
                      <div className="text-sm text-muted-foreground">Active</div>
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
                      <div className="text-sm text-muted-foreground">Needs Attention</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Wills List */}
                <WillList
                  wills={testatorWills}
                  isLoading={isLoading}
                  error={error}
                  onCreateWill={handleCreateWill}
                  onWillAction={handleWillAction}
                  showStats={false} // Stats sudah ditampilkan di atas
                  title="Wills as Testator"
                />
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-4xl mb-4">🔒</div>
                  <h3 className="text-xl font-semibold mb-2">Wallet Not Connected</h3>
                  <p className="text-muted-foreground">
                    Connect your wallet to view and manage wills as testator
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
