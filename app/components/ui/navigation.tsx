import React from "react";
import { Link } from "react-router";
import { cn } from "../../lib/utils";

interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  isExternal?: boolean;
}

interface NavigationProps {
  items: NavigationItem[];
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export function Navigation({ 
  items, 
  className,
  orientation = "horizontal" 
}: NavigationProps) {
  const navClasses = orientation === "horizontal" 
    ? "flex space-x-6" 
    : "flex flex-col space-y-2";

  return (
    <nav className={cn(navClasses, className)}>
      {items.map((item, index) => (
        <NavigationLink key={index} item={item} />
      ))}
    </nav>
  );
}

function NavigationLink({ item }: { item: NavigationItem }) {
  const linkClasses = "flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors";
  
  if (item.isExternal) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClasses}
      >
        {item.icon && <span>{item.icon}</span>}
        <span>{item.label}</span>
      </a>
    );
  }

  return (
    <Link to={item.href} className={linkClasses}>
      {item.icon && <span>{item.icon}</span>}
      <span>{item.label}</span>
    </Link>
  );
}

// Pre-built navigation sets
export const mainNavItems: NavigationItem[] = [
  { label: "Home", href: "/", icon: "🏠" },
  { label: "Features", href: "/features", icon: "⚡" },
  { label: "How It Works", href: "/about", icon: "❓" },
  { label: "Dashboard", href: "/dashboard", icon: "📊" }
];

export const dashboardNavItems: NavigationItem[] = [
  { label: "Overview", href: "/dashboard", icon: "📊" },
  { label: "My Wills", href: "/dashboard/testator", icon: "📝" },
  { label: "Check Will", href: "/beneficiary/check", icon: "🔍" }
];

export const footerNavItems: NavigationItem[] = [
  { label: "Privacy Policy", href: "/privacy", icon: "🔒" },
  { label: "Terms of Service", href: "/terms", icon: "📄" },
  { label: "FAQ", href: "/faq", icon: "❓" },
  { label: "Support", href: "/support", icon: "💬" },
  { label: "GitHub", href: "https://github.com/wasiat-online", icon: "💻", isExternal: true }
];

// Mobile navigation component
export function MobileNavigation({ 
  items, 
  isOpen, 
  onClose 
}: { 
  items: NavigationItem[]; 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-64 bg-background border-l p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={onClose} className="text-2xl">×</button>
        </div>
        <nav className="space-y-4">
          {items.map((item, index) => (
            <div key={index} onClick={onClose}>
              {item.isExternal ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  {item.icon && <span>{item.icon}</span>}
                  <span>{item.label}</span>
                </a>
              ) : (
                <Link 
                  to={item.href} 
                  className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  {item.icon && <span>{item.icon}</span>}
                  <span>{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
