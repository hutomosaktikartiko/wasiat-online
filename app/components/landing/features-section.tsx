import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";

const features = [
  {
    icon: "🔒",
    title: "Secure",
    description: "Users retain full control of private keys, assets secured by smart contract logic",
    details: [
      "Private keys remain in your hands",
      "Audited smart contracts",
      "Non-custodial solution"
    ]
  },
  {
    icon: "🤖",
    title: "Automatic", 
    description: "Asset transfers occur automatically based on rules, without expensive intermediaries",
    details: [
      "Automatic trigger via keeper service",
      "No need for notary or lawyer",
      "Instant execution when conditions are met"
    ]
  },
  {
    icon: "⚡",
    title: "Efficient & Affordable",
    description: "Built on Solana with low transaction costs and near-instant processing",
    details: [
      "Transaction costs < $0.01",
      "Confirmation in seconds",
      "High scalability"
    ]
  }
];

export function FeaturesSection() {
  return (
    <section className="py-20 px-4">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Wasiat Online?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Crypto inheritance solution that combines blockchain security with ease of use
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-5xl mb-4">{feature.icon}</div>
                <CardTitle className="text-2xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-primary">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
