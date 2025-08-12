import type { Route } from "./+types/features";
import { MainLayout } from "../components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Fitur — Wasiat Online" },
    { name: "description", content: "Jelajahi semua fitur Wasiat Online untuk mengamankan warisan digital Anda" },
  ];
}

const currentFeatures = [
  {
    icon: "🔒",
    title: "Aman & Non-Custodial",
    description: "Private key tetap di tangan Anda, smart contract mengamankan aset",
    status: "available"
  },
  {
    icon: "🤖",
    title: "Otomatis & Transparan",
    description: "Trigger otomatis tanpa perantara, semua terjadi on-chain",
    status: "available"
  },
  {
    icon: "⚡",
    title: "Cepat & Murah",
    description: "Dibangun di Solana, biaya transaksi < $0.01",
    status: "available"
  },
  {
    icon: "💎",
    title: "Multi-Asset Support",
    description: "Mendukung SOL, SPL Token, dan NFT dalam satu wasiat",
    status: "beta"
  },
  {
    icon: "💓",
    title: "Heartbeat System",
    description: "Sistem pembuktian aktivitas yang fleksibel dan mudah",
    status: "available"
  },
  {
    icon: "📱",
    title: "Mobile Friendly",
    description: "Interface responsif yang bekerja di semua perangkat",
    status: "available"
  }
];

const upcomingFeatures = [
  {
    icon: "👥",
    title: "Multi-Beneficiary",
    description: "Bagikan warisan ke beberapa penerima dengan persentase custom",
    status: "planned"
  },
  {
    icon: "🛡️",
    title: "Guardian System",
    description: "Multi-signature heartbeat untuk keamanan tambahan",
    status: "planned"
  },
  {
    icon: "📧",
    title: "Notification System",
    description: "Email reminder untuk heartbeat dan status updates",
    status: "planned"
  },
  {
    icon: "🏛️",
    title: "Governance Token",
    description: "Partisipasi komunitas dalam pengembangan platform",
    status: "planned"
  },
  {
    icon: "🌐",
    title: "Cross-Chain Support",
    description: "Ekspansi ke Ethereum, Polygon, dan blockchain lainnya",
    status: "planned"
  },
  {
    icon: "📊",
    title: "Analytics Dashboard",
    description: "Insights mendalam tentang portfolio dan statistik warisan",
    status: "planned"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "available": return "bg-green-100 text-green-800 border-green-200";
    case "beta": return "bg-blue-100 text-blue-800 border-blue-200";
    case "planned": return "bg-orange-100 text-orange-800 border-orange-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "available": return "Tersedia";
    case "beta": return "Beta";
    case "planned": return "Direncanakan";
    default: return "Unknown";
  }
};

export default function Features() {
  return (
    <MainLayout>
      <div className="py-12 px-4">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Fitur Wasiat Online
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Platform inheritance crypto yang lengkap dengan fitur-fitur canggih 
              untuk mengamankan masa depan aset digital Anda.
            </p>
          </div>

          {/* Current Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">🚀 Fitur Saat Ini</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentFeatures.map((feature, index) => (
                <Card key={index} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl">{feature.icon}</div>
                      <Badge className={getStatusColor(feature.status)}>
                        {getStatusText(feature.status)}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Upcoming Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">🔮 Fitur Mendatang</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingFeatures.map((feature, index) => (
                <Card key={index} className="relative opacity-75">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl">{feature.icon}</div>
                      <Badge className={getStatusColor(feature.status)}>
                        {getStatusText(feature.status)}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Roadmap CTA */}
          <div className="text-center">
            <Card className="p-8 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-2xl">📋 Lihat Roadmap Lengkap</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Ingin tahu lebih detail tentang pengembangan Wasiat Online? 
                  Lihat roadmap lengkap kami dengan timeline dan milestone yang jelas.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="https://github.com/wasiat-online/roadmap" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    📊 Lihat Roadmap
                  </a>
                  <a 
                    href="https://github.com/wasiat-online/wasiat-online" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-md hover:bg-primary/10 transition-colors"
                  >
                    💻 Contribute
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
