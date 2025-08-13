import { useWallet as useSolanaWallet, useConnection } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { getSOLBalance } from "../lib/solana/utils";
import { PublicKey } from "@solana/web3.js";

export function useWallet() {
  const wallet = useSolanaWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch balance when wallet connects
  useEffect(() => {
    if (wallet.publicKey && connection) {
      fetchBalance();
    } else {
      setBalance(0);
    }
  }, [wallet.publicKey, connection]);

  const fetchBalance = async () => {
    if (!wallet.publicKey || !connection) return;
    
    setIsLoading(true);
    try {
      const bal = await getSOLBalance(connection, wallet.publicKey);
      setBalance(bal);
    } catch (error) {
      console.error("Error fetching balance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBalance = () => {
    fetchBalance();
  };

  const getUserRoleByWill = (testator: PublicKey, beneficiary: PublicKey) => {
    if (wallet.publicKey?.equals(testator)) {
      return "testator";
    } else if (wallet.publicKey?.equals(beneficiary)) {
      return "beneficiary";
    } else {
      return "viewer";
    }
  }

  return {
    ...wallet,
    balance,
    isLoading,
    refreshBalance,
    isConnected: wallet.connected && !!wallet.publicKey,
    getUserRoleByWill,
  };
}
