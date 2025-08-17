import type { Route } from "./+types/create";
import { MainLayout } from "../../components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { useNavigate } from "react-router";
import { CreateWillForm } from "../../components/will/create-will-form";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Create Will — Wasiat Online" },
    { name: "description", content: "Create digital will to secure your crypto inheritance" },
    
    // Open Graph
    { property: "og:title", content: "Create Your Crypto Will — Wasiat Online" },
    { property: "og:description", content: "Start securing your crypto inheritance today. Create your digital will in minutes." },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "/logo.png" },
    
    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Create Your Crypto Will" },
    { name: "twitter:description", content: "Secure your crypto inheritance in minutes with Wasiat Online." },
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
            <h1 className="text-3xl font-bold mb-4">📝 Create New Will</h1>
            <p className="text-muted-foreground">
              Create digital will to secure the future of your crypto assets
            </p>
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Will Information</CardTitle>
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
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <span>Create will with beneficiary information</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <span>Deposit SOL to vault</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <span>Send heartbeat periodically</span>
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
