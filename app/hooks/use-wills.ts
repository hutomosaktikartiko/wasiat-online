import { useState, useCallback, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import { useProgram } from "../providers/program-provider";
import { useWallet } from "./use-wallet";
import { WillStatus } from "../types/will";
import type { WillWithStatus } from "../types/will";
import { getSOLBalance } from "../lib/solana/utils";
import { toast } from "react-hot-toast";

export interface WillsState {
  wills: WillWithStatus[];
  testatorWills: WillWithStatus[];
  beneficiaryWills: WillWithStatus[];
  isLoading: boolean;
  error: string | null;
}

export interface WillsStats {
  totalWills: number;
  activeWills: number;
  totalSOLValue: number;
  triggeredWills: number;
}

/**
 * Hook untuk mengelola multiple wills
 * Fetch wills dimana user adalah testator atau beneficiary
 */
export function useWills() {
  const { connection } = useConnection();
  const { program, readOnlyProgram } = useProgram();
  const wallet = useWallet();

  const [state, setState] = useState<WillsState>({
    wills: [],
    testatorWills: [],
    beneficiaryWills: [],
    isLoading: false,
    error: null,
  });

  // Convert raw will data to WillWithStatus
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
      canClaim: willData.status.triggered && wallet.publicKey?.equals(willData.beneficiary) || false,
      canWithdraw: willData.status.active && wallet.publicKey?.equals(willData.testator) || false,
      canHeartbeat: willData.status.active && 
                    wallet.publicKey?.equals(willData.testator) || false,
      // PDA address
      address: willPDA,
    };
  }, [connection, wallet.publicKey]);

  // Fetch all wills untuk user saat ini
  const fetchWills = useCallback(async () => {
    if (!wallet.publicKey || !readOnlyProgram) {
      setState(prev => ({
        ...prev,
        wills: [],
        testatorWills: [],
        beneficiaryWills: [],
        isLoading: false,
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Fetch all will accounts dari program
      const willAccounts = await readOnlyProgram.account.will.all();
      
      // Filter wills dimana user adalah testator atau beneficiary
      const userWills: WillWithStatus[] = [];
      const testatorWills: WillWithStatus[] = [];
      const beneficiaryWills: WillWithStatus[] = [];

      for (const willAccount of willAccounts) {
        const willData = willAccount.account;
        const willPDA = willAccount.publicKey;
        
        // Check if user is testator or beneficiary
        const isTestator = willData.testator.equals(wallet.publicKey);
        const isBeneficiary = willData.beneficiary.equals(wallet.publicKey);
        
        if (isTestator || isBeneficiary) {
          const processedWill = await processWillData(willData, willPDA);
          userWills.push(processedWill);
          
          if (isTestator) {
            testatorWills.push(processedWill);
          }
          if (isBeneficiary) {
            beneficiaryWills.push(processedWill);
          }
        }
      }

      // Sort by creation date (newest first)
      const sortByDate = (a: WillWithStatus, b: WillWithStatus) => b.createdAt - a.createdAt;
      userWills.sort(sortByDate);
      testatorWills.sort(sortByDate);
      beneficiaryWills.sort(sortByDate);

      setState(prev => ({
        ...prev,
        wills: userWills,
        testatorWills,
        beneficiaryWills,
        isLoading: false,
      }));

    } catch (err) {
      console.error("Error fetching wills:", err);
      const error = err instanceof Error ? err.message : "Failed to fetch wills";
      setState(prev => ({
        ...prev,
        error,
        isLoading: false,
      }));
      toast.error(`Error fetching wills: ${error}`);
    }
  }, [wallet.publicKey, readOnlyProgram, processWillData]);

  // Auto-fetch when wallet changes
  useEffect(() => {
    fetchWills();
  }, [fetchWills]);

  // Calculate statistics
  const stats: WillsStats = {
    totalWills: state.wills.length,
    activeWills: state.wills.filter(w => w.status === WillStatus.Active).length,
    totalSOLValue: state.wills.reduce((sum, w) => sum + w.vaultBalance, 0),
    triggeredWills: state.wills.filter(w => w.status === WillStatus.Triggered).length,
  };

  // Get wills by status
  const getWillsByStatus = useCallback((status: WillStatus) => {
    return state.wills.filter(will => will.status === status);
  }, [state.wills]);

  // Get wills that need attention (expired, can claim, etc)
  const getWillsNeedingAttention = useCallback(() => {
    return state.wills.filter(will => 
      will.canClaim || 
      (will.status === WillStatus.Active && will.isExpired) ||
      (will.status === WillStatus.Created && will.vaultBalance === 0)
    );
  }, [state.wills]);

  return {
    ...state,
    stats,
    fetchWills,
    getWillsByStatus,
    getWillsNeedingAttention,
    // Convenience getters
    hasWills: state.wills.length > 0,
    hasTestatorWills: state.testatorWills.length > 0,
    hasBeneficiaryWills: state.beneficiaryWills.length > 0,
  };
}
