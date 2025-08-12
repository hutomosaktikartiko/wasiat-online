import React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "../ui/card";

const steps = [
  {
    step: 1,
    title: "Buat Wasiat",
    description: "Tentukan penerima manfaat dan periode heartbeat (misal: 90 hari)",
    icon: "📝",
    color: "bg-blue-50 text-blue-600 border-blue-200"
  },
  {
    step: 2, 
    title: "Setor Aset",
    description: "Transfer SOL, SPL Token, atau NFT ke vault yang aman",
    icon: "💰",
    color: "bg-green-50 text-green-600 border-green-200"
  },
  {
    step: 3,
    title: "Kirim Heartbeat",
    description: "Konfirmasi aktivitas secara berkala untuk reset timer",
    icon: "💓",
    color: "bg-red-50 text-red-600 border-red-200"
  },
  {
    step: 4,
    title: "Trigger Otomatis",
    description: "Sistem otomatis mengaktifkan wasiat jika heartbeat berhenti",
    icon: "🤖",
    color: "bg-purple-50 text-purple-600 border-purple-200"
  },
  {
    step: 5,
    title: "Klaim Aset",
    description: "Penerima manfaat dapat mengklaim aset dengan mudah",
    icon: "🎯",
    color: "bg-orange-50 text-orange-600 border-orange-200"
  }
];

export function HowItWorksSection() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bagaimana Cara Kerjanya?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Proses sederhana dalam 5 langkah untuk mengamankan warisan crypto Anda
          </p>
        </div>
        
        <div className="grid md:grid-cols-5 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className={`text-center ${step.color} border-2`}>
                <CardHeader className="pb-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl mb-4 shadow-md">
                    {step.icon}
                  </div>
                  <div className="text-lg font-bold mb-2">
                    {step.step}
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {step.description}
                  </CardDescription>
                </CardHeader>
              </Card>
              
              {/* Arrow connector (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <div className="w-6 h-6 bg-white border-2 border-primary rounded-full flex items-center justify-center">
                    <span className="text-primary text-sm">→</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Mobile connectors */}
        <div className="md:hidden flex justify-center mt-8">
          <div className="text-muted-foreground text-sm">
            Scroll ke samping untuk melihat semua langkah →
          </div>
        </div>
      </div>
    </section>
  );
}
