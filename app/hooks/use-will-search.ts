import { useState, useCallback } from "react";
import { PublicKey } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import { useProgram } from "../providers/program-provider";
import { WillStatus } from "../types/will";
import type { WillWithStatus } from "../types/will";
import { getSOLBalance } from "../lib/solana/utils";
import { toast } from "react-hot-toast";

export interface WillSearchResult {
  will: WillWithStatus | null;
  found: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook untuk search will berdasarkan alamat
 */
export function useWillSearch() {
  const { connection } = useConnection();
  const { readOnlyProgram } = useProgram();
  const [result, setResult] = useState<WillSearchResult>({
    will: null,
    found: false,
    isLoading: false,
    error: null,
  });

  // Validate alamat Solana
  const isValidSolanaAddress = useCallback((address: string): boolean => {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }, []);

  // Process will data menjadi WillWithStatus
  const processWillData = useCallback(async (willData: any, willPDA: PublicKey): Promise<WillWithStatus> => {
    const vaultBalance = await getSOLBalance(connection, willData.vault);
    
    // Calculate computed properties
    const now = Math.floor(Date.now() / 1000);
    const lastHeartbeat = willData.lastHeartbeat.toNumber();
    const heartbeatPeriod = willData.heartbeatPeriod;
    const expiryTime = lastHeartbeat + heartbeatPeriod;
    
    const isExpired = now > expiryTime;
    const timeUntilExpiry = Math.max(0, expiryTime - now);
    
    return {
      testator: willData.testator,
      beneficiary: willData.beneficiary,
      vault: willData.vault,
      heartbeatPeriod: willData.heartbeatPeriod,
      status: willData.status.created ? WillStatus.Created :
              willData.status.active ? WillStatus.Active :
              willData.status.triggered ? WillStatus.Triggered :
              willData.status.claimed ? WillStatus.Claimed :
              WillStatus.Withdrawn,
      createdAt: willData.createdAt.toNumber(),
      lastHeartbeat: lastHeartbeat,
      triggerAt: willData.triggerAt ? willData.triggerAt.toNumber() : null,
      bump: willData.bump,
      vaultBump: willData.vaultBump,
      reserved: Array.from(willData.reserved),
      // Computed properties
      isExpired,
      timeUntilExpiry,
      vaultBalance,
      canClaim: willData.status.triggered,
      canWithdraw: willData.status.active,
      canHeartbeat: willData.status.active,
      address: willPDA,
    };
  }, [connection]);

  // Search will berdasarkan alamat
  const searchWill = useCallback(async (address: string): Promise<WillSearchResult> => {
    if (!address.trim()) {
      const error = "Alamat wasiat tidak boleh kosong";
      setResult({ will: null, found: false, isLoading: false, error });
      return { will: null, found: false, isLoading: false, error };
    }

    if (!isValidSolanaAddress(address.trim())) {
      const error = "Alamat Solana tidak valid";
      setResult({ will: null, found: false, isLoading: false, error });
      toast.error(error);
      return { will: null, found: false, isLoading: false, error };
    }

    if (!readOnlyProgram) {
      const error = "Program belum siap";
      setResult({ will: null, found: false, isLoading: false, error });
      return { will: null, found: false, isLoading: false, error };
    }

    setResult({ will: null, found: false, isLoading: true, error: null });

    try {
      const willPDA = new PublicKey(address.trim());
      
      // Try to fetch will account
      const willData = await readOnlyProgram.account.will.fetch(willPDA);
      const processedWill = await processWillData(willData, willPDA);
      
      const searchResult = {
        will: processedWill,
        found: true,
        isLoading: false,
        error: null,
      };

      setResult(searchResult);
      toast.success("Wasiat ditemukan!");
      return searchResult;

    } catch (err) {
      console.error("Error searching will:", err);
      
      let error = "Wasiat tidak ditemukan";
      if (err instanceof Error) {
        if (err.message.includes("Account does not exist")) {
          error = "Wasiat dengan alamat tersebut tidak ditemukan";
        } else if (err.message.includes("Invalid public key")) {
          error = "Format alamat tidak valid";
        } else {
          error = `Error: ${err.message}`;
        }
      }

      const searchResult = {
        will: null,
        found: false,
        isLoading: false,
        error,
      };

      setResult(searchResult);
      toast.error(error);
      return searchResult;
    }
  }, [readOnlyProgram, isValidSolanaAddress, processWillData]);

  // Clear search results
  const clearSearch = useCallback(() => {
    setResult({
      will: null,
      found: false,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...result,
    searchWill,
    clearSearch,
    isValidSolanaAddress,
  };
}
