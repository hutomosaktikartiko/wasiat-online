import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { useNavigate } from "react-router";

export function CTASection() {
  const navigate = useNavigate();

  const stats = [
    { label: "Active Wills", value: "500+", icon: "📋" },
    { label: "Total Value", value: "$1M+", icon: "💎" },
    { label: "Success Rate", value: "99.9%", icon: "✅" },
    { label: "Avg. Fees", value: "<$0.01", icon: "💰" }
  ];

  return (
    <section className="py-20 px-4 bg-primary/5">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Mulai Amankan Warisan Digital Anda
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ratusan pengguna yang telah mempercayai Wasiat Online 
            untuk mengamankan masa depan aset crypto mereka
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button onClick={() => navigate("/will/create")} size="lg" className="text-lg px-8 py-6">
              🚀 Buat Wasiat Sekarang
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              💬 Hubungi Tim
            </Button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Trust badges */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">Dipercaya oleh</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-sm font-semibold">🏛️ DeFi Protocols</div>
            <div className="text-sm font-semibold">👥 Crypto Communities</div>
            <div className="text-sm font-semibold">🏢 Web3 Companies</div>
            <div className="text-sm font-semibold">💼 Individual Investors</div>
          </div>
        </div>
      </div>
    </section>
  );
}
