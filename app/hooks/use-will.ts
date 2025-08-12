import { useState, useCallback, useEffect } from "react";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
const { BN } = anchor;
import { useProgram } from "../providers/program-provider";
import { useWallet } from "./use-wallet";
import { useTransaction } from "./use-transaction";
import { WillStatus } from "../types/will";
import type { 
  Will, 
  WillWithStatus, 
  CreateWillParams, 
  WillOperationResult 
} from "../types/will";
import { 
  getWillPDA, 
  getVaultPDA, 
  getAllWillPDAs,
  getGlobalConfigPDA,
  getFeeVaultPDA 
} from "../lib/anchor/pda";
import { MIN_HEARTBEAT_PERIOD } from "../lib/utils/constants";
import { getSOLBalance } from "../lib/solana/utils";
import { toast } from "react-hot-toast";

export function useWill(
  testator?: PublicKey,
  beneficiary?: PublicKey,
  willAddress?: PublicKey
) {
  const { connection } = useConnection();
  const { program, readOnlyProgram, config } = useProgram();
  const wallet = useWallet();
  const transaction = useTransaction();

  const [will, setWill] = useState<WillWithStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine will PDA: prefer explicit willAddress, fallback to derived from testator+beneficiary
  const willPDA = willAddress
    ? willAddress
    : testator && beneficiary
      ? getWillPDA(testator, beneficiary)[0]
      : null;

  // Fetch will data
  const fetchWill = useCallback(async () => {
    if (!willPDA || !readOnlyProgram) return;

    // Hindari setState berlebih jika pemanggil sering memicu
    setIsLoading((prev) => (prev ? prev : true));
    setError(null);

    try {
      const willData = await readOnlyProgram.account.will.fetch(willPDA);
      const vaultBalance = await getSOLBalance(connection, willData.vault);
      
      // Calculate computed properties
      const now = Math.floor(Date.now() / 1000);
      const lastHeartbeat = willData.lastHeartbeat.toNumber();
      const heartbeatPeriod = willData.heartbeatPeriod;
      const expiryTime = lastHeartbeat + heartbeatPeriod;
      
      const isExpired = now > expiryTime;
      const timeUntilExpiry = Math.max(0, expiryTime - now);
      
      const willWithStatus: WillWithStatus = {
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
        canWithdraw: (willData.status.created || willData.status.active) && 
                     wallet.publicKey?.equals(willData.testator) || false,
        canHeartbeat: willData.status.active && 
                      wallet.publicKey?.equals(willData.testator) || false,
        address: willPDA,
      };

      setWill(willWithStatus);
    } catch (err) {
      console.error("Error fetching will:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch will");
    } finally {
      setIsLoading(false);
    }
  }, [willPDA, readOnlyProgram, connection, wallet.publicKey]);

  // Auto-fetch when dependencies change
  useEffect(() => {
    if (!willPDA) return;
    fetchWill();
    // Hanya rerun saat alamat will berubah agar tidak loop karena referensi fungsi berubah
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [willPDA]);

  // Create Will
  const createWill = useCallback(async (
    params: CreateWillParams
  ): Promise<WillOperationResult> => {
    if (!program || !wallet.publicKey) {
      return { signature: "", success: false, error: "Wallet not connected" };
    }

    // Use default values if config not loaded yet
    const minHeartbeatPeriod = config?.minHeartbeatPeriod || MIN_HEARTBEAT_PERIOD;
    
    // Validate heartbeat period
    if (params.heartbeatPeriod < minHeartbeatPeriod) {
      return { 
        signature: "", 
        success: false, 
        error: `Heartbeat period must be at least ${minHeartbeatPeriod} seconds` 
      };
    }

    try {
      const pdas = getAllWillPDAs(wallet.publicKey, params.beneficiary);
      
      const tx = await program.methods
        .createWill(params.beneficiary, params.heartbeatPeriod)
        .accounts({
          testator: wallet.publicKey,
          config: pdas.config,
          will: pdas.will,
          vault: pdas.vault,
          systemProgram: SystemProgram.programId,
        } as any)
        .transaction();

      const signature = await transaction.executeTransaction(tx, {
        onSuccess: () => {
          toast.success("Wasiat berhasil dibuat!");
          fetchWill();
        },
        onError: (error) => {
          toast.error(`Gagal membuat wasiat: ${error}`);
        }
      });

      return {
        signature: signature || "",
        success: !!signature,
        error: signature ? undefined : "Transaction failed"
      };

    } catch (err) {
      const error = err instanceof Error ? err.message : "Failed to create will";
      toast.error(`Gagal membuat wasiat: ${error}`);
      return { signature: "", success: false, error };
    }
  }, [program, wallet.publicKey, config, transaction, fetchWill]);

  // Deposit SOL
  const depositSOL = useCallback(async (
    amount: number
  ): Promise<WillOperationResult> => {
    if (!program || !wallet.publicKey || !will) {
      return { signature: "", success: false, error: "Invalid state" };
    }

    const lamports = Math.floor(amount * LAMPORTS_PER_SOL);
    
    try {
      const tx = await program.methods
        .depositSol(new BN(lamports))
        .accounts({
          testator: wallet.publicKey,
          will: willPDA!,
          vault: will.vault,
          systemProgram: SystemProgram.programId,
        } as any)
        .transaction();

      const signature = await transaction.executeTransaction(tx, {
        onSuccess: () => {
          toast.success(`Berhasil deposit ${amount} SOL!`);
          fetchWill();
          wallet.refreshBalance();
        },
        onError: (error) => {
          toast.error(`Gagal deposit SOL: ${error}`);
        }
      });

      return {
        signature: signature || "",
        success: !!signature,
        error: signature ? undefined : "Transaction failed"
      };

    } catch (err) {
      const error = err instanceof Error ? err.message : "Failed to deposit SOL";
      toast.error(`Gagal deposit SOL: ${error}`);
      return { signature: "", success: false, error };
    }
  }, [program, wallet, will, willPDA, transaction, fetchWill]);

  // Send Heartbeat
  const sendHeartbeat = useCallback(async (): Promise<WillOperationResult> => {
    if (!program || !wallet.publicKey || !will) {
      return { signature: "", success: false, error: "Invalid state" };
    }

    try {
      const [configPDA] = getGlobalConfigPDA();
      
      const tx = await program.methods
        .sendHeartbeat()
        .accounts({
          testator: wallet.publicKey,
          config: configPDA,
          will: willPDA!,
        } as any)
        .transaction();

      const signature = await transaction.executeTransaction(tx, {
        onSuccess: () => {
          toast.success("Heartbeat berhasil dikirim!");
          fetchWill();
        },
        onError: (error) => {
          toast.error(`Gagal kirim heartbeat: ${error}`);
        }
      });

      return {
        signature: signature || "",
        success: !!signature,
        error: signature ? undefined : "Transaction failed"
      };

    } catch (err) {
      const error = err instanceof Error ? err.message : "Failed to send heartbeat";
      toast.error(`Gagal kirim heartbeat: ${error}`);
      return { signature: "", success: false, error };
    }
  }, [program, wallet.publicKey, will, willPDA, transaction, fetchWill]);

  // Withdraw SOL
  const withdrawSOL = useCallback(async (): Promise<WillOperationResult> => {
    if (!program || !wallet.publicKey || !will) {
      return { signature: "", success: false, error: "Invalid state" };
    }

    try {
      const [configPDA] = getGlobalConfigPDA();
      
      const tx = await program.methods
        .withdrawSol()
        .accounts({
          testator: wallet.publicKey,
          will: willPDA!,
          vault: will.vault,
          config: configPDA,
          systemProgram: SystemProgram.programId,
        } as any)
        .transaction();

      const signature = await transaction.executeTransaction(tx, {
        onSuccess: () => {
          toast.success("SOL berhasil ditarik!");
          fetchWill();
          wallet.refreshBalance();
        },
        onError: (error) => {
          toast.error(`Gagal tarik SOL: ${error}`);
        }
      });

      return {
        signature: signature || "",
        success: !!signature,
        error: signature ? undefined : "Transaction failed"
      };

    } catch (err) {
      const error = err instanceof Error ? err.message : "Failed to withdraw SOL";
      toast.error(`Gagal tarik SOL: ${error}`);
      return { signature: "", success: false, error };
    }
  }, [program, wallet, will, willPDA, transaction, fetchWill]);

  // Claim SOL
  const claimSOL = useCallback(async (): Promise<WillOperationResult> => {
    if (!program || !wallet.publicKey || !will) {
      return { signature: "", success: false, error: "Invalid state" };
    }

    try {
      const [configPDA] = getGlobalConfigPDA();
      const [feeVaultPDA] = getFeeVaultPDA();
      
      const tx = await program.methods
        .claimSol()
        .accounts({
          beneficiary: wallet.publicKey,
          will: willPDA!,
          vault: will.vault,
          config: configPDA,
          feeVault: feeVaultPDA,
          systemProgram: SystemProgram.programId,
        } as any)
        .transaction();

      const signature = await transaction.executeTransaction(tx, {
        onSuccess: () => {
          toast.success("SOL berhasil diklaim!");
          fetchWill();
          wallet.refreshBalance();
        },
        onError: (error) => {
          toast.error(`Gagal klaim SOL: ${error}`);
        }
      });

      return {
        signature: signature || "",
        success: !!signature,
        error: signature ? undefined : "Transaction failed"
      };

    } catch (err) {
      const error = err instanceof Error ? err.message : "Failed to claim SOL";
      toast.error(`Gagal klaim SOL: ${error}`);
      return { signature: "", success: false, error };
    }
  }, [program, wallet, will, willPDA, transaction, fetchWill]);

  return {
    will,
    isLoading,
    error,
    fetchWill,
    createWill,
    depositSOL,
    sendHeartbeat,
    withdrawSOL,
    claimSOL,
    transaction,
  };
}
