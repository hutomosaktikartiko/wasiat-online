import type { Route } from "./+types/$id";
import { MainLayout } from "../../components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { StatusBadge } from "../../components/ui/status-badge";
import { CopyAddress, CopyHash } from "../../components/ui/copy-button";
import { CountdownTimer } from "../../components/ui/countdown-timer";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Will ${params.id} — Wasiat Online` },
    { name: "description", content: "Detail wasiat dan manajemen aset" },
  ];
}

export default function WillDetail({ params }: Route.ComponentProps) {
  const willId = params.id;

  // Mock data - will be replaced with real data later
  const mockWill = {
    id: willId,
    testator: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    beneficiary: "8WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWN",
    status: "active" as const,
    createdAt: new Date("2024-01-15"),
    lastHeartbeat: new Date("2024-01-20"),
    heartbeatPeriod: 90,
    assets: {
      sol: 2.5,
      tokens: [],
      nfts: []
    },
    vault: "7VzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWO",
    transactions: [
      {
        id: "tx_1",
        type: "heartbeat",
        signature: "5J7zDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWP",
        timestamp: new Date("2024-01-20"),
        status: "success" as const
      },
      {
        id: "tx_2", 
        type: "deposit",
        signature: "6K8eDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWQ",
        timestamp: new Date("2024-01-18"),
        status: "success" as const,
        amount: 2.5,
        asset: "SOL"
      }
    ]
  };

  const nextHeartbeatDeadline = new Date(
    mockWill.lastHeartbeat.getTime() + mockWill.heartbeatPeriod * 24 * 60 * 60 * 1000
  );

  return (
    <MainLayout>
      <div className="py-8 px-4">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold">Detail Wasiat</h1>
              <p className="text-muted-foreground">ID: {willId}</p>
            </div>
            <StatusBadge status={mockWill.status} />
          </div>

          {/* Will Info */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>📋 Informasi Wasiat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-semibold">Pewasiat</label>
                  <CopyAddress address={mockWill.testator} />
                </div>
                <div>
                  <label className="text-sm font-semibold">Penerima Manfaat</label>
                  <CopyAddress address={mockWill.beneficiary} />
                </div>
                <div>
                  <label className="text-sm font-semibold">Vault Address</label>
                  <CopyAddress address={mockWill.vault} />
                </div>
                <div>
                  <label className="text-sm font-semibold">Dibuat</label>
                  <p className="text-sm">{mockWill.createdAt.toLocaleDateString('id-ID')}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>💓 Status Heartbeat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-semibold">Periode Heartbeat</label>
                  <p className="text-sm">{mockWill.heartbeatPeriod} hari</p>
                </div>
                <div>
                  <label className="text-sm font-semibold">Heartbeat Terakhir</label>
                  <p className="text-sm">{mockWill.lastHeartbeat.toLocaleDateString('id-ID')}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold">Waktu Tersisa</label>
                  <CountdownTimer targetDate={nextHeartbeatDeadline} size="sm" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Assets */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>💰 Aset dalam Vault</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{mockWill.assets.sol}</div>
                  <div className="text-sm text-muted-foreground">SOL</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{mockWill.assets.tokens.length}</div>
                  <div className="text-sm text-muted-foreground">SPL Tokens</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{mockWill.assets.nfts.length}</div>
                  <div className="text-sm text-muted-foreground">NFTs</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>⚡ Aksi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button className="w-full" disabled>
                  💓 Send Heartbeat
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  💰 Manage Assets
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  📤 Withdraw Assets
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Actions akan aktif setelah wallet integration selesai
              </p>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle>📄 Riwayat Transaksi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockWill.transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-semibold capitalize">{tx.type}</div>
                      <div className="text-sm text-muted-foreground">
                        {tx.timestamp.toLocaleDateString('id-ID')} {tx.timestamp.toLocaleTimeString('id-ID')}
                      </div>
                      {'amount' in tx && (
                        <div className="text-sm">
                          {tx.amount} {tx.asset}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={tx.status} />
                      <CopyHash hash={tx.signature} label="Tx" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
