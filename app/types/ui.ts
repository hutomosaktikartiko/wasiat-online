import type { Will } from "./will";

export interface WillCardProps {
  will: Will;
  onHeartbeat?: () => void;
  onDeposit?: () => void;
  onWithdraw?: () => void;
  onClaim?: () => void;
}

export interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  backgroundImage?: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
  details: string[];
}

export interface Step {
  step: number;
  title: string;
  description: string;
  icon: string;
  action: string;
}

export interface CTASectionProps {
  title: string;
  description: string;
  primaryCTA: string;
  secondaryCTA: string;
  stats: {
    totalWills: string;
    totalValue: string;
    successRate: string;
  };
}

export interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar: string;
}
