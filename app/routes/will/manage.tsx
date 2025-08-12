import type { Route } from "./+types/manage";
import { MainLayout } from "../../components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { StatusBadge } from "../../components/ui/status-badge";
import { EmptyWills } from "../../components/ui/empty-state";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Kelola Wasiat — Wasiat Online" },
    { name: "description", content: "Kelola semua wasiat Anda dalam satu tempat" },
  ];
}

// Mock data - will be replaced with real data later
const mockWills = [
  {
    id: "will_1",
    beneficiary: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    status: "active" as const,
    createdAt: new Date("2024-01-15"),
    lastHeartbeat: new Date("2024-01-20"),
    heartbeatPeriod: 90,
    assets: {
      sol: 2.5,
      tokens: 0,
      nfts: 0
    }
  },
  {
    id: "will_2", 
    beneficiary: "8WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWN",
    status: "created" as const,
    createdAt: new Date("2024-01-10"),
    lastHeartbeat: null,
    heartbeatPeriod: 60,
    assets: {
      sol: 0,
      tokens: 0,
      nfts: 0
    }
  }
];

const formatAddress = (address: string) => {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

const getDaysUntilExpiry = (lastHeartbeat: Date | null, period: number) => {
  if (!lastHeartbeat) return period;
  const now = new Date();
  const expiryDate = new Date(lastHeartbeat.getTime() + period * 24 * 60 * 60 * 1000);
  const daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, daysLeft);
};

export default function ManageWills() {
  return (
    <MainLayout>
      <div className="py-8 px-4">
        <div className="container">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold">Kelola Wasiat</h1>
              <p className="text-muted-foreground">
                Kelola semua wasiat Anda dalam satu tempat
              </p>
            </div>
            <Button asChild>
              <Link to="/will/create">
                ➕ Buat Wasiat Baru
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">{mockWills.length}</div>
                <div className="text-sm text-muted-foreground">Total Wasiat</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  {mockWills.filter(w => w.status === 'active').length}
                </div>
                <div className="text-sm text-muted-foreground">Aktif</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {mockWills.reduce((sum, w) => sum + w.assets.sol, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total SOL</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {mockWills.reduce((sum, w) => sum + w.assets.nfts, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total NFTs</div>
              </CardContent>
            </Card>
          </div>

          {/* Wills List */}
          {mockWills.length === 0 ? (
            <EmptyWills />
          ) : (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Daftar Wasiat</h2>
              
              {mockWills.map((will) => (
                <Card key={will.id}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div>
                        <CardTitle className="text-lg">
                          Wasiat untuk {formatAddress(will.beneficiary)}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Dibuat: {will.createdAt.toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <StatusBadge status={will.status} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4">
                      {/* Assets */}
                      <div>
                        <h4 className="font-semibold mb-2">💰 Aset</h4>
                        <div className="space-y-1 text-sm">
                          <div>SOL: {will.assets.sol}</div>
                          <div>Tokens: {will.assets.tokens}</div>
                          <div>NFTs: {will.assets.nfts}</div>
                        </div>
                      </div>
                      
                      {/* Heartbeat */}
                      <div>
                        <h4 className="font-semibold mb-2">💓 Heartbeat</h4>
                        <div className="space-y-1 text-sm">
                          <div>Periode: {will.heartbeatPeriod} hari</div>
                          <div>
                            Sisa: {getDaysUntilExpiry(will.lastHeartbeat, will.heartbeatPeriod)} hari
                          </div>
                        </div>
                      </div>
                      
                      {/* Last Activity */}
                      <div>
                        <h4 className="font-semibold mb-2">📅 Aktivitas</h4>
                        <div className="space-y-1 text-sm">
                          <div>
                            Terakhir: {will.lastHeartbeat 
                              ? will.lastHeartbeat.toLocaleDateString('id-ID')
                              : 'Belum ada'
                            }
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div>
                        <h4 className="font-semibold mb-2">⚡ Aksi</h4>
                        <div className="space-y-2">
                          <Button size="sm" variant="outline" className="w-full" disabled>
                            💓 Heartbeat
                          </Button>
                          <Button size="sm" variant="outline" className="w-full" asChild>
                            <Link to={`/will/${will.id}`}>
                              👁️ Detail
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-8">
            <Card className="p-6 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-xl">🚀 Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-auto flex-col py-4" asChild>
                    <Link to="/will/create">
                      <div className="text-2xl mb-2">📝</div>
                      <div>Buat Wasiat</div>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col py-4" disabled>
                    <div className="text-2xl mb-2">💓</div>
                    <div>Heartbeat Semua</div>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col py-4" disabled>
                    <div className="text-2xl mb-2">💰</div>
                    <div>Kelola Aset</div>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col py-4" disabled>
                    <div className="text-2xl mb-2">📊</div>
                    <div>Lihat Analytics</div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
