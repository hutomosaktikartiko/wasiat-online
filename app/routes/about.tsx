import type { Route } from "./+types/about";
import { MainLayout } from "../components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cara Kerja — Wasiat Online" },
    { name: "description", content: "Pelajari bagaimana Wasiat Online bekerja untuk mengamankan warisan digital Anda" },
  ];
}

const steps = [
  {
    step: 1,
    title: "Create Will",
    description: "Set beneficiary and heartbeat period (e.g., 90 days)",
    icon: "📝",
    details: [
      "Enter Solana address of beneficiary",
      "Set appropriate heartbeat period",
      "Smart contract automatically creates separate vault"
    ]
  },
  {
    step: 2, 
    title: "Deposit Assets",
    description: "Transfer SOL, SPL Tokens, or NFTs to secure vault",
    icon: "💰",
    details: [
      "Assets stored in Program Derived Address (PDA)",
      "Only smart contract can access",
      "Testator can withdraw anytime before triggered"
    ]
  },
  {
    step: 3,
    title: "Send Heartbeat",
    description: "Periodically confirm activity to reset timer",
    icon: "💓",
    details: [
      "Click heartbeat button in dashboard",
      "Timer resets to initial period (90 days)",
      "Can be done anytime while will is active"
    ]
  },
  {
    step: 4,
    title: "Auto Trigger",
    description: "System automatically activates will if heartbeat stops",
    icon: "🤖",
    details: [
      "Keeper service monitors all wills 24/7",
      "Automatically triggers when timer expires",
      "Will status changes to 'Triggered'"
    ]
  },
  {
    step: 5,
    title: "Claim Assets",
    description: "Beneficiary can easily claim assets",
    icon: "🎯",
    details: [
      "Beneficiary connects wallet and verifies identity",
      "Smart contract transfers all assets",
      "Small fee deducted for platform sustainability"
    ]
  }
];

export default function About() {
  return (
    <MainLayout>
      <div className="py-12 px-4">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How Does Wasiat Online Work?
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Simple 5-step process to secure your crypto inheritance 
              using safe and transparent blockchain technology.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="lg:w-1/2">
                  <Card className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                        {step.step}
                      </div>
                      <div className="text-4xl">{step.icon}</div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-primary mt-1">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
                <div className="lg:w-1/2 text-center">
                  <div className="text-8xl opacity-20 font-bold">
                    {step.step}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Security Section */}
          <div className="mt-20">
            <Card className="p-8 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-center text-2xl">🔒 Security & Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">🔐 Non-Custodial</h4>
                    <p className="text-sm text-muted-foreground">
                      You have full control over your private keys. Wasiat Online never 
                      accesses or stores your private keys.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">🏛️ Smart Contract</h4>
                    <p className="text-sm text-muted-foreground">
                      All logic is stored in audited and transparent smart contracts 
                      on the Solana blockchain.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">⚡ Solana Network</h4>
                    <p className="text-sm text-muted-foreground">
                      Built on Solana for fast transactions and low costs, 
                      with enterprise-grade security.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">📊 Open Source</h4>
                    <p className="text-sm text-muted-foreground">
                      Open source code that can be verified by anyone. 
                      Full transparency for maximum trust.
                    </p>
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
