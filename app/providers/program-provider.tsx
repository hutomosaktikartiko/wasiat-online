import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import * as anchor from "@coral-xyz/anchor";
const { Program } = anchor;
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import type { WasiatOnline } from "../lib/anchor/idl";
import { createProgram, createReadOnlyProgram } from "../lib/anchor/client";
import { useWallet } from "../hooks/use-wallet";
import { getGlobalConfigPDA } from "../lib/anchor/pda";
import type { Config } from "../types/will";

interface ProgramContextType {
  program: anchor.Program<WasiatOnline> | null;
  readOnlyProgram: anchor.Program<WasiatOnline>;
  config: Config | null;
  configAddress: PublicKey;
  isLoading: boolean;
  error: string | null;
  refetchConfig: () => Promise<void>;
}

const ProgramContext = createContext<ProgramContextType | null>(null);

export function ProgramProvider({ children }: { children: ReactNode }) {
  const { connection } = useConnection();
  const wallet = useWallet();
  
  const [program, setProgram] = useState<anchor.Program<WasiatOnline> | null>(null);
  const [readOnlyProgram, setReadOnlyProgram] = useState<anchor.Program<WasiatOnline> | null>(null);
  const [config, setConfig] = useState<Config | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get config PDA address
  const [configAddress] = getGlobalConfigPDA();

  // Initialize read-only program (always available)
  useEffect(() => {
    if (connection) {
      const roProgram = createReadOnlyProgram(connection);
      setReadOnlyProgram(roProgram);
    }
  }, [connection]);

  // Initialize program with wallet (when connected)
  useEffect(() => {
    if (connection && wallet.publicKey) {
      const prog = createProgram(connection, wallet);
      setProgram(prog);
    } else {
      setProgram(null);
    }
  }, [connection, wallet.publicKey]);

  // Fetch config data
  const fetchConfig = async () => {
    if (!readOnlyProgram) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const configData = await readOnlyProgram.account.config.fetch(configAddress);
      
      // Convert to our Config interface
      const config: Config = {
        authority: configData.authority,
        feeVault: configData.feeVault,
        tokenFeeBps: configData.tokenFeeBps,
        nftFeeLamports: configData.nftFeeLamports.toNumber(),
        minHeartbeatPeriod: configData.minHeartbeatPeriod,
        maxHeartbeatPeriod: configData.maxHeartbeatPeriod,
        minHeartbeatInterval: configData.minHeartbeatInterval,
        paused: configData.paused,
        bump: configData.bump,
        reserved: Array.from(configData.reserved),
      };

      setConfig(config);
    } catch (err) {
      console.error("Error fetching config:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch config");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch config when read-only program is ready
  useEffect(() => {
    if (readOnlyProgram) {
      fetchConfig();
    }
  }, [readOnlyProgram]);

  const value: ProgramContextType = {
    program,
    readOnlyProgram: readOnlyProgram!,
    config,
    configAddress,
    isLoading,
    error,
    refetchConfig: fetchConfig,
  };

  return (
    <ProgramContext.Provider value={value}>
      {children}
    </ProgramContext.Provider>
  );
}

export function useProgram() {
  const context = useContext(ProgramContext);
  if (!context) {
    throw new Error("useProgram must be used within a ProgramProvider");
  }
  return context;
}