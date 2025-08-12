import React from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export function HeroSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
      <div className="container max-w-5xl">
        <div className="text-center">
          {/* Badge */}
          <Badge variant="secondary" className="mb-6 text-sm font-medium">
            🚀 Beta version - Built on Solana
          </Badge>
          
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Wasiat Online —{" "}
            <span className="text-primary block md:inline">
              Crypto Inheritance Vault
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Menciptakan standar baru yang <strong>aman, transparan, dan terotomatisasi</strong> untuk 
            pewarisan aset digital di blockchain. Pastikan tidak ada lagi aset kripto yang hilang selamanya 
            karena sebuah tragedi.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {/* Go to create will page */}
            <Button onClick={() => window.location.href = "/will/create"} size="lg" className="text-lg px-8 py-6">
              🎯 Mulai Buat Wasiat
            </Button>
            <Button onClick={() => window.location.href = "/about"} variant="outline" size="lg" className="text-lg px-8 py-6">
              📚 Pelajari Cara Kerja
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Non-custodial</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Open Source</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Solana Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Low Fees</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
