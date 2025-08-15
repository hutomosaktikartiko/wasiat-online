import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";

const features = [
  {
    icon: "🔒",
    title: "Aman",
    description: "Pengguna memegang kendali penuh atas private key, aset diamankan oleh smart contract",
    details: [
      "Private key tetap di tangan Anda",
      "Smart contract telah diaudit",
      "Non-custodial solution"
    ]
  },
  {
    icon: "🤖",
    title: "Otomatis", 
    description: "Transfer aset terjadi otomatis berdasarkan aturan, tanpa perantara mahal",
    details: [
      "Trigger otomatis via keeper service",
      "Tidak perlu notaris atau lawyer",
      "Eksekusi instan saat kondisi terpenuhi"
    ]
  },
  {
    icon: "⚡",
    title: "Efisien & Terjangkau",
    description: "Dibangun di Solana dengan biaya transaksi murah dan proses hampir seketika",
    details: [
      "Biaya transaksi < $0.01",
      "Konfirmasi dalam detik",
      "Skalabilitas tinggi"
    ]
  }
];

export function FeaturesSection() {
  return (
    <section className="py-20 px-4">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Mengapa Wasiat Online?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Solusi inheritance crypto yang menggabungkan keamanan blockchain dengan kemudahan penggunaan
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
