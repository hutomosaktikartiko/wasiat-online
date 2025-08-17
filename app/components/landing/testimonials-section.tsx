import { Card, CardContent } from "../ui/card";

const testimonials = [
  {
    name: "Ahmad Reza",
    role: "Crypto Investor & DeFi Enthusiast",
    content: "Wasiat Online provides incredible peace of mind. Now I know my crypto assets are safe for my family, without worrying about lost private keys.",
    avatar: "👨‍💼"
  },
  {
    name: "Sarah Chen", 
    role: "NFT Collector & Web3 Builder",
    content: "Very user-friendly interface and transparent process! I can easily set up inheritance for my NFT collection. The support team is also very responsive.",
    avatar: "👩‍🎨"
  },
  {
    name: "Michael Torres",
    role: "Solana Developer",
    content: "As a developer, I really appreciate the clean code and well-audited smart contracts. Wasiat Online is built with best practices and top-notch security.",
    avatar: "👨‍💻"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-20 px-4">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Users Say?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Thousands of users have trusted Wasiat Online to secure the future of their crypto assets
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
            <strong>4.9/5</strong> rating based on <strong>150+</strong> reviews
          </p>
        </div>
      </div>
    </section>
  );
}
