import type { Route } from "./+types/create";
import { MainLayout } from "../../components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useNavigate } from "react-router";
import { CreateWillForm } from "../../components/will/create-will-form";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Buat Wasiat — Wasiat Online" },
    { name: "description", content: "Buat wasiat digital untuk mengamankan warisan crypto Anda" },
  ];
}

export default function CreateWill() {
  const navigate = useNavigate();

  const handleSuccess = (willAddress: any) => {
    // Redirect to will details page
    navigate(`/will/${willAddress.toBase58()}`);
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

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
              <CreateWillForm 
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
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
                    <span>Deposit SOL ke vault</span>
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
