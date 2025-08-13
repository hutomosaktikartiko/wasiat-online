import React, { useState, useEffect } from "react";

interface ClientOnlyWalletProps {
  children: React.ReactNode;
}

// Client-only wrapper for wallet components
export function ClientOnlyWallet({ children }: ClientOnlyWalletProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Server-side fallback - render children without wallet providers
    return <>{children}</>;
  }

  // Client-side - render with wallet providers
  return <>{children}</>;
}
