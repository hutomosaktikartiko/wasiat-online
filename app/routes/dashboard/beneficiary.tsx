import type { Route } from "./+types/beneficiary";
import { MainLayout } from "../../components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { EmptyState } from "../../components/ui/empty-state";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard Beneficiary — Wasiat Online" },
    { name: "description", content: "Cek status wasiat dan klaim warisan yang ditujukan untuk Anda" },
  ];
}

export default function BeneficiaryDashboard() {
  return (
    <MainLayout>
      <div className="py-8 px-4">
        <div className="container">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Dashboard Beneficiary</h1>
            <p className="text-muted-foreground">
              Cek status wasiat dan klaim warisan yang ditujukan untuk Anda
            </p>
          </div>

          {/* Search Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>🔍 Cek Status Wasiat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="will-search" className="sr-only">Alamat Wasiat</Label>
                  <Input 
                    id="will-search"
                    placeholder="Masukkan alamat wasiat untuk dicek..."
                    disabled
                  />
                </div>
                <Button disabled>
                  🔍 Cari Wasiat
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Alamat wasiat biasanya diberikan oleh pewasiat atau tersimpan dalam dokumen warisan
              </p>
            </CardContent>
          </Card>

          {/* Empty State */}
          <EmptyState
            icon="🎯"
            title="Belum Ada Wasiat Ditemukan"
            description="Masukkan alamat wasiat di atas untuk mengecek status dan mengklaim warisan yang ditujukan untuk Anda."
          />

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
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

          {/* Demo Section */}
          <div className="mt-8">
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">💡 Demo Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-800 text-sm">
                  Saat ini dalam mode demo. Wallet integration sedang dalam pengembangan. 
                  Dalam versi production, Anda akan dapat melihat status wasiat real-time 
                  dan mengklaim aset yang tersedia langsung melalui dashboard ini.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
