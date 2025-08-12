import type { Route } from "./+types/check";
import { MainLayout } from "../../components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cek Status Wasiat — Wasiat Online" },
    { name: "description", content: "Cek status wasiat dan klaim warisan yang telah dipicu" },
  ];
}

export default function BeneficiaryCheck() {
  return (
    <MainLayout>
      <div className="py-8 px-4">
        <div className="container max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">🔍 Cek Status Wasiat</h1>
            <p className="text-muted-foreground">
              Masukkan alamat wasiat untuk mengecek status dan mengklaim warisan
            </p>
          </div>

          {/* Search Form */}
          <Card>
            <CardHeader>
              <CardTitle>Cari Wasiat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="will-address">Alamat Wasiat</Label>
                <Input
                  id="will-address"
                  placeholder="Masukkan alamat wasiat yang ingin dicek"
                  disabled
                />
                <p className="text-sm text-muted-foreground">
                  Alamat wasiat biasanya diberikan oleh pewasiat kepada Anda
                </p>
              </div>

              <Button className="w-full" disabled>
                🔍 Cek Status Wasiat (Coming Soon)
              </Button>
            </CardContent>
          </Card>

          {/* How to Find */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>❓ Bagaimana Cara Mendapatkan Alamat Wasiat?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mt-1">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold">Dari Pewasiat Langsung</h4>
                      <p className="text-sm text-muted-foreground">
                        Pewasiat akan memberikan alamat wasiat kepada Anda sebagai penerima manfaat
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mt-1">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold">Melalui Notifikasi</h4>
                      <p className="text-sm text-muted-foreground">
                        Sistem akan mengirim notifikasi jika wasiat telah dipicu dan siap diklaim
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mt-1">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold">Dokumen Warisan</h4>
                      <p className="text-sm text-muted-foreground">
                        Alamat wasiat mungkin disimpan dalam dokumen warisan atau safe deposit box
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Demo Status */}
          <div className="mt-8">
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">💡 Demo Status Wasiat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded border">
                      <h4 className="font-semibold text-green-700">✅ Wasiat Triggered</h4>
                      <p className="text-sm text-muted-foreground">Siap diklaim oleh beneficiary</p>
                    </div>
                    <div className="p-4 bg-white rounded border">
                      <h4 className="font-semibold text-blue-700">🔄 Wasiat Aktif</h4>
                      <p className="text-sm text-muted-foreground">Pewasiat masih mengirim heartbeat</p>
                    </div>
                  </div>
                  <p className="text-sm text-blue-800">
                    Dalam versi production, Anda akan dapat melihat status real-time dan mengklaim aset yang tersedia.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
