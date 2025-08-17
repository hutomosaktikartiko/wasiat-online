import type { Route } from "./+types/home";
import { MainLayout } from "../components/layout/main-layout";
import { HeroSection } from "../components/landing/hero-section";
import { FeaturesSection } from "../components/landing/features-section";
import { HowItWorksSection } from "../components/landing/how-it-works-section";
import { TestimonialsSection } from "../components/landing/testimonials-section";
import { CTASection } from "../components/landing/cta-section";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Wasiat Online — Crypto Inheritance Vault" },
    { name: "description", content: "New secure, transparent, and automated standard for digital asset inheritance on blockchain" },
    
    // Open Graph
    { property: "og:title", content: "Wasiat Online — Crypto Inheritance Vault" },
    { property: "og:description", content: "Secure your crypto inheritance with automated, transparent blockchain technology. No more lost assets." },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "/logo.png" },
    { property: "og:url", content: "https://wasiat.online" },
    
    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Wasiat Online — Crypto Inheritance Vault" },
    { name: "twitter:description", content: "Secure your crypto inheritance with automated, transparent blockchain technology." },
    { name: "twitter:image", content: "/logo.png" },
  ];
}

export default function Home() {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </MainLayout>
  );
}
