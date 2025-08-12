import React from "react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export function Header() {
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

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Beranda
          </Link>
          <Link 
            to="/about" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Cara Kerja
          </Link>
          <Link 
            to="/features" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Fitur
          </Link>
          <Link 
            to="/dashboard" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Dashboard
          </Link>
        </nav>

        {/* Wallet Connection */}
        <div className="flex items-center space-x-4">
          <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !text-primary-foreground !font-medium !px-4 !py-2 !rounded-md !transition-colors" />
        </div>
      </div>
    </header>
  );
}
