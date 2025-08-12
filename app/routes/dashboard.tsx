import type { Route } from "./+types/dashboard";
import { MainLayout } from "../components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard — Wasiat Online" },
    { name: "description", content: "Manage your crypto inheritance wills and monitor your wallet status" },
  ];
}

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="py-8 px-4">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your wills and monitor your wallet status
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Wallet Status */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Wallet Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="text-4xl mb-4">🔒</div>
                    <p>Wallet integration coming soon</p>
                    <p className="text-sm">We're working on SSR compatibility</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Wills Overview */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Your Wills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="text-4xl mb-4">📋</div>
                    <p>No wills created yet</p>
                    <p className="text-sm">Connect your wallet and create your first will</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
