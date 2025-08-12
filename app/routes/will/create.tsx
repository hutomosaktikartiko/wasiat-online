import type { Route } from "./+types/create";
import { MainLayout } from "../../components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Buat Wasiat — Wasiat Online" },
    { name: "description", content: "Buat wasiat digital untuk mengamankan warisan crypto Anda" },
  ];
}

export default function CreateWill() {
  return (
    <MainLayout>
      <div className="py-8 px-4">
        <div className="container max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">📝 Buat Wasiat Baru</h1>
            <p className="text-muted-foreground">
              Buat wasiat digital untuk mengamankan masa depan aset crypto Anda
            </p>
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Wasiat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Beneficiary */}
              <div className="space-y-2">
                <Label htmlFor="beneficiary">Alamat Penerima Manfaat *</Label>
                <Input
                  id="beneficiary"
                  placeholder="Masukkan alamat Solana penerima manfaat"
                  disabled
                />
                <p className="text-sm text-muted-foreground">
                  Alamat Solana yang akan menerima aset setelah wasiat dipicu
                </p>
              </div>

              {/* Heartbeat Period */}
              <div className="space-y-2">
                <Label htmlFor="heartbeat">Periode Heartbeat (hari) *</Label>
                <Input
                  id="heartbeat"
                  type="number"
                  placeholder="90"
                  disabled
                />
                <p className="text-sm text-muted-foreground">
                  Jika Anda tidak mengirim heartbeat dalam periode ini, wasiat akan dipicu
                </p>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Informasi Penting</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Setelah wasiat dibuat, Anda bisa deposit aset ke vault</li>
                  <li>• Kirim heartbeat secara berkala untuk mencegah trigger otomatis</li>
                  <li>• Anda bisa withdraw aset kapan saja sebelum wasiat dipicu</li>
                  <li>• Fee kecil akan dipotong saat beneficiary claim aset</li>
                </ul>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1" disabled>
                  🚀 Buat Wasiat (Coming Soon)
                </Button>
                <Button variant="outline" className="flex-1">
                  ↩️ Kembali ke Dashboard
                </Button>
              </div>

              {/* Wallet Status */}
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">🔒 Wallet Integration</h4>
                <p className="text-sm text-orange-800">
                  Wallet integration sedang dalam pengembangan. 
                  Saat ini Anda dapat menjelajahi UI dan fitur-fitur platform.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Steps */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Langkah Selanjutnya</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <span>Buat wasiat dengan informasi beneficiary</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <span>Deposit aset (SOL, SPL Token, NFT) ke vault</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <span>Kirim heartbeat secara berkala</span>
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
