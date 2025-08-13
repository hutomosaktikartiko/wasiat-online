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
    { name: "description", content: "Standar baru yang aman, transparan, dan terotomatisasi untuk pewarisan aset digital di blockchain" },
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
