import type { Route } from "./+types/testator";
import { MainLayout } from "../../components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard Pewasiat — Wasiat Online" },
    { name: "description", content: "Kelola wasiat dan monitor aset inheritance Anda" },
  ];
}

// Mock data - will be replaced with real data later
const mockWills = [
  {
    id: "will_1",
    beneficiary: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    status: "active",
    createdAt: 1703980800,
    lastHeartbeat: 1704067200,
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
    status: "created",
    createdAt: 1703894400,
    lastHeartbeat: null,
    heartbeatPeriod: 60,
    assets: {
      sol: 0,
      tokens: 0,
      nfts: 0
    }
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-green-100 text-green-800 border-green-200";
    case "created": return "bg-blue-100 text-blue-800 border-blue-200";
    case "triggered": return "bg-red-100 text-red-800 border-red-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "active": return "Aktif";
    case "created": return "Dibuat";
    case "triggered": return "Dipicu";
    default: return "Unknown";
  }
};

const formatAddress = (address: string) => {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

export default function TestatorDashboard() {
  return (
    <MainLayout>
      <div className="py-8 px-4">
        <div className="container">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard Pewasiat</h1>
              <p className="text-muted-foreground">
                Kelola wasiat dan monitor status inheritance Anda
              </p>
            </div>
            <Button className="mt-4 sm:mt-0">
              ➕ Buat Wasiat Baru
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">2</div>
                <div className="text-sm text-muted-foreground">Total Wasiat</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">1</div>
                <div className="text-sm text-muted-foreground">Aktif</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">2.5</div>
                <div className="text-sm text-muted-foreground">Total SOL</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-sm text-muted-foreground">NFTs</div>
              </CardContent>
            </Card>
          </div>

          {/* Wills List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Wasiat Anda</h2>
            
            {mockWills.map((will) => (
              <Card key={will.id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <CardTitle className="text-lg">
                        Wasiat untuk {formatAddress(will.beneficiary)}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Dibuat: {new Date(will.createdAt * 1000).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <Badge className={getStatusColor(will.status)}>
                      {getStatusText(will.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
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
                          Terakhir: {will.lastHeartbeat 
                            ? new Date(will.lastHeartbeat * 1000).toLocaleDateString('id-ID')
                            : 'Belum ada'
                          }
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div>
                      <h4 className="font-semibold mb-2">⚡ Aksi</h4>
                      <div className="space-y-2">
                        <Button size="sm" variant="outline" className="w-full">
                          💓 Heartbeat
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          💰 Kelola Aset
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          👁️ Detail
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <Card className="p-6 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-xl">🚀 Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto flex-col py-4">
                    <div className="text-2xl mb-2">📝</div>
                    <div>Buat Wasiat Baru</div>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col py-4">
                    <div className="text-2xl mb-2">💓</div>
                    <div>Kirim Heartbeat</div>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col py-4">
                    <div className="text-2xl mb-2">💰</div>
                    <div>Tambah Aset</div>
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
