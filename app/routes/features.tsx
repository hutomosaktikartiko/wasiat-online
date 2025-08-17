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
    title: "Secure & Non-Custodial",
    description: "Private keys remain in your hands, smart contracts secure assets",
    status: "available"
  },
  {
    icon: "🤖",
    title: "Automatic & Transparent",
    description: "Automatic trigger without intermediaries, everything happens on-chain",
    status: "available"
  },
  {
    icon: "⚡",
    title: "Fast & Cheap",
    description: "Built on Solana, transaction costs < $0.01",
    status: "available"
  },
  {
    icon: "💎",
    title: "Multi-Asset Support",
    description: "Supports SOL, SPL Tokens, and NFTs in one will",
    status: "beta"
  },
  {
    icon: "💓",
    title: "Heartbeat System",
    description: "Flexible and easy activity proof system",
    status: "available"
  },
  {
    icon: "📱",
    title: "Mobile Friendly",
    description: "Responsive interface that works on all devices",
    status: "available"
  }
];

const upcomingFeatures = [
  {
    icon: "👥",
    title: "Multi-Beneficiary",
    description: "Share inheritance to multiple beneficiaries with custom percentages",
    status: "planned"
  },
  {
    icon: "🛡️",
    title: "Guardian System",
    description: "Multi-signature heartbeat for additional security",
    status: "planned"
  },
  {
    icon: "📧",
    title: "Notification System",
    description: "Email reminders for heartbeat and status updates",
    status: "planned"
  },
  {
    icon: "🏛️",
    title: "Governance Token",
    description: "Community participation in platform development",
    status: "planned"
  },
  {
    icon: "🌐",
    title: "Cross-Chain Support",
    description: "Expansion to Ethereum, Polygon, and other blockchains",
    status: "planned"
  },
  {
    icon: "📊",
    title: "Analytics Dashboard",
    description: "Deep insights about portfolio and inheritance statistics",
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
    case "available": return "Available";
    case "beta": return "Beta";
    case "planned": return "Planned";
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
              Wasiat Online Features
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Complete crypto inheritance platform with advanced features 
              to secure the future of your digital assets.
            </p>
          </div>

          {/* Current Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">🚀 Current Features</h2>
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
            <h2 className="text-3xl font-bold text-center mb-8">🔮 Upcoming Features</h2>
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
                <CardTitle className="text-2xl">📋 View Complete Roadmap</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Want to know more details about Wasiat Online development? 
                  Check out our complete roadmap with clear timeline and milestones.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="https://github.com/wasiat-online/roadmap" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    📊 View Roadmap
                  </a>
                  <a 
                    href="https://github.com/hutomosaktikartiko/wasiat-online" 
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
