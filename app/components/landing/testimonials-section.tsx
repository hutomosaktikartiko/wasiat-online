import { Card, CardContent } from "../ui/card";

const testimonials = [
  {
    name: "Ahmad Reza",
    role: "Crypto Investor & DeFi Enthusiast",
    content: "Wasiat Online memberikan ketenangan pikiran yang luar biasa. Sekarang saya tahu aset crypto saya aman untuk keluarga, tanpa perlu khawatir tentang private key yang hilang.",
    avatar: "👨‍💼"
  },
  {
    name: "Sarah Chen", 
    role: "NFT Collector & Web3 Builder",
    content: "Interface yang sangat user-friendly dan proses yang transparan! Saya bisa dengan mudah mengatur inheritance untuk koleksi NFT saya. Tim support juga sangat responsif.",
    avatar: "👩‍🎨"
  },
  {
    name: "Michael Torres",
    role: "Solana Developer",
    content: "Sebagai developer, saya sangat menghargai kode yang clean dan smart contract yang well-audited. Wasiat Online built with best practices dan security yang top-notch.",
    avatar: "👨‍💻"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-20 px-4">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Apa Kata Pengguna Kami?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ribuan pengguna telah mempercayai Wasiat Online untuk mengamankan masa depan aset crypto mereka
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative">
              <CardContent className="p-6">
                {/* Quote icon */}
                <div className="text-4xl text-primary mb-4 opacity-20">
                  "
                </div>
                
                {/* Content */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Rating */}
        <div className="text-center mt-12">
          <div className="flex justify-center items-center gap-2 mb-2">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-xl">⭐</span>
            ))}
          </div>
          <p className="text-muted-foreground">
            <strong>4.9/5</strong> rating berdasarkan <strong>150+</strong> reviews
          </p>
        </div>
      </div>
    </section>
  );
}
