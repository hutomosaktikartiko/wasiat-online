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
    title: "Buat Wasiat",
    description: "Tentukan penerima manfaat dan periode heartbeat (misal: 90 hari)",
    icon: "📝",
    details: [
      "Masukkan alamat Solana penerima manfaat",
      "Tentukan periode heartbeat yang sesuai",
      "Smart contract otomatis membuat vault terpisah"
    ]
  },
  {
    step: 2, 
    title: "Setor Aset",
    description: "Transfer SOL, SPL Token, atau NFT ke vault yang aman",
    icon: "💰",
    details: [
      "Aset disimpan di Program Derived Address (PDA)",
      "Hanya smart contract yang bisa mengakses",
      "Testator dapat withdraw kapan saja sebelum triggered"
    ]
  },
  {
    step: 3,
    title: "Kirim Heartbeat",
    description: "Konfirmasi aktivitas secara berkala untuk reset timer",
    icon: "💓",
    details: [
      "Klik tombol heartbeat di dashboard",
      "Timer direset ke periode awal (90 hari)",
      "Dapat dilakukan kapan saja selama wasiat aktif"
    ]
  },
  {
    step: 4,
    title: "Trigger Otomatis",
    description: "Sistem otomatis mengaktifkan wasiat jika heartbeat berhenti",
    icon: "🤖",
    details: [
      "Keeper service monitoring semua wasiat 24/7",
      "Otomatis trigger jika timer habis",
      "Status wasiat berubah menjadi 'Triggered'"
    ]
  },
  {
    step: 5,
    title: "Klaim Aset",
    description: "Penerima manfaat dapat mengklaim aset dengan mudah",
    icon: "🎯",
    details: [
      "Beneficiary connect wallet dan verifikasi identitas",
      "Smart contract transfer semua aset",
      "Fee kecil dipotong untuk sustainability platform"
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
              Bagaimana Cara Kerja Wasiat Online?
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Proses sederhana dalam 5 langkah untuk mengamankan warisan crypto Anda 
              menggunakan teknologi blockchain yang aman dan transparan.
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
                <CardTitle className="text-center text-2xl">🔒 Keamanan & Transparansi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">🔐 Non-Custodial</h4>
                    <p className="text-sm text-muted-foreground">
                      Anda memiliki kendali penuh atas private key. Wasiat Online tidak pernah 
                      mengakses atau menyimpan private key Anda.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">🏛️ Smart Contract</h4>
                    <p className="text-sm text-muted-foreground">
                      Semua logika disimpan dalam smart contract yang telah diaudit dan 
                      transparan di blockchain Solana.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">⚡ Solana Network</h4>
                    <p className="text-sm text-muted-foreground">
                      Dibangun di Solana untuk transaksi cepat dan biaya rendah, 
                      dengan keamanan tingkat enterprise.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">📊 Open Source</h4>
                    <p className="text-sm text-muted-foreground">
                      Kode sumber terbuka dan dapat diverifikasi oleh siapa saja. 
                      Transparansi penuh untuk kepercayaan maksimal.
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
