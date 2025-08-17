import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { Navigation, mainNavItems, MobileNavigation } from "../ui/navigation";
import { WalletMultiButton } from "../wallet/wallet-multi-button";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
          <img src="/logo.png" alt="Wasiat Online" className="h-8 w-8" />
          <span className="font-bold text-xl hidden sm:block">Wasiat Online</span>
          <span className="font-bold text-lg sm:hidden">Wasiat</span>
        </Link>

        {/* Desktop Navigation - Hidden on Mobile */}
        <div className="hidden lg:block">
          <Navigation items={mainNavItems} />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Wallet Button - Responsive Size */}
          <div className="hidden sm:block">
            <WalletMultiButton variant="outline" />
          </div>
          <div className="sm:hidden">
            <WalletMultiButton variant="outline" size="sm" />
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="text-lg">☰</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation
        items={mainNavItems}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
}
