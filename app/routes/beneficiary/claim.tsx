import type { Route } from "./+types/claim";
import { MainLayout } from "../../components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { StatusBadge } from "../../components/ui/status-badge";
import { CopyAddress } from "../../components/ui/copy-button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Klaim Aset — Wasiat Online" },
    { name: "description", content: "Klaim warisan aset yang telah dipicu" },
  ];
}

export default function ClaimAssets() {
  // Mock triggered will data
  const mockTriggeredWill = {
    id: "will_triggered_1",
    testator: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    beneficiary: "8WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWN",
    status: "triggered" as const,
    triggeredAt: new Date("2024-01-25"),
    lastHeartbeat: new Date("2024-01-20"),
    heartbeatPeriod: 5, // 5 days for demo
    assets: {
      sol: 5.25,
      tokens: [
        { mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", amount: 100, symbol: "USDC" },
        { mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", amount: 50, symbol: "USDT" }
      ],
      nfts: [
        { mint: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU", name: "Cool NFT #1" },
        { mint: "6yKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsV", name: "Digital Art #2" }
      ]
    },
    estimatedFees: {
      sol: 0.05, // 1% fee
      percentage: 1
    }
  };

  const totalValueAfterFees = mockTriggeredWill.assets.sol - mockTriggeredWill.estimatedFees.sol;

  return (
    <MainLayout>
      <div className="py-8 px-4">
        <div className="container max-w-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">🎯 Klaim Aset Warisan</h1>
            <p className="text-muted-foreground">
              Wasiat telah dipicu dan siap untuk diklaim
            </p>
          </div>

          {/* Will Status */}
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-orange-900">📋 Status Wasiat</CardTitle>
                <StatusBadge status={mockTriggeredWill.status} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-semibold">Pewasiat</label>
                  <CopyAddress address={mockTriggeredWill.testator} />
                </div>
                <div>
                  <label className="font-semibold">Dipicu pada</label>
                  <p>{mockTriggeredWill.triggeredAt.toLocaleDateString('id-ID')}</p>
                </div>
                <div>
                  <label className="font-semibold">Heartbeat terakhir</label>
                  <p>{mockTriggeredWill.lastHeartbeat.toLocaleDateString('id-ID')}</p>
                </div>
                <div>
                  <label className="font-semibold">Periode heartbeat</label>
                  <p>{mockTriggeredWill.heartbeatPeriod} hari</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assets Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>💰 Aset yang Dapat Diklaim</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* SOL */}
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">💎 Solana (SOL)</h4>
                    <span className="text-lg font-bold">{mockTriggeredWill.assets.sol} SOL</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div>Fee platform: {mockTriggeredWill.estimatedFees.sol} SOL ({mockTriggeredWill.estimatedFees.percentage}%)</div>
                    <div className="font-semibold">Yang akan diterima: {totalValueAfterFees} SOL</div>
                  </div>
                </div>

                {/* SPL Tokens */}
                {mockTriggeredWill.assets.tokens.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">🪙 SPL Tokens</h4>
                    {mockTriggeredWill.assets.tokens.map((token, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg">
                        <div className="flex justify-between items-center">
                          <span>{token.symbol}</span>
                          <span className="font-semibold">{token.amount} {token.symbol}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Mint: {token.mint.slice(0, 8)}...{token.mint.slice(-8)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* NFTs */}
                {mockTriggeredWill.assets.nfts.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">🖼️ NFTs</h4>
                    {mockTriggeredWill.assets.nfts.map((nft, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg">
                        <div className="font-semibold">{nft.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Mint: {nft.mint.slice(0, 8)}...{nft.mint.slice(-8)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Claim Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>🚀 Klaim Aset</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">📝 Langkah Klaim</h4>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Connect wallet Anda (harus sesuai dengan alamat beneficiary)</li>
                    <li>2. Verifikasi identitas sebagai beneficiary yang sah</li>
                    <li>3. Konfirmasi transaksi klaim aset</li>
                    <li>4. Aset akan ditransfer ke wallet Anda secara otomatis</li>
                  </ol>
                </div>

                <div className="space-y-3">
                  <Button className="w-full" size="lg" disabled>
                    🔒 Connect Wallet untuk Klaim
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    Wallet integration sedang dalam pengembangan
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-900">⚠️ Penting untuk Diketahui</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-yellow-800 space-y-2">
                <li>• Anda hanya dapat mengklaim aset jika wallet Anda adalah beneficiary yang tercatat</li>
                <li>• Fee platform akan dipotong secara otomatis dari total aset</li>
                <li>• Proses klaim tidak dapat dibatalkan setelah transaksi dikonfirmasi</li>
                <li>• Pastikan alamat wallet Anda benar sebelum melakukan klaim</li>
                <li>• Simpan transaction signature sebagai bukti klaim berhasil</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
