import React, { useState } from "react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { Navigation, mainNavItems, MobileNavigation } from "../ui/navigation";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">W</span>
          </div>
          <span className="font-bold text-xl">Wasiat Online</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <Navigation items={mainNavItems} />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Button variant="outline">Connect Wallet (Coming Soon)</Button>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            ☰
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
