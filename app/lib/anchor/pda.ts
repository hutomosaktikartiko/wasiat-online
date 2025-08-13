import { PublicKey } from "@solana/web3.js";
import { PROGRAM_ID, SEEDS } from "../utils/constants";

/**
 * Derive Global Config PDA
 */
export function getGlobalConfigPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEEDS.CONFIG)],
    new PublicKey(PROGRAM_ID)
  );
}

/**
 * Derive Fee Vault PDA
 */
export function getFeeVaultPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEEDS.FEE_VAULT)],
    new PublicKey(PROGRAM_ID)
  );
}

/**
 * Derive Will PDA
 */
export function getWillPDA(
  testator: PublicKey,
  beneficiary: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(SEEDS.WILL),
      testator.toBuffer(),
      beneficiary.toBuffer()
    ],
    new PublicKey(PROGRAM_ID)
  );
}

/**
 * Derive Vault PDA for a Will
 */
export function getVaultPDA(willAccount: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(SEEDS.VAULT),
      willAccount.toBuffer()
    ],
    new PublicKey(PROGRAM_ID)
  );
}

/**
 * Get all PDAs for a Will
 */
export function getAllWillPDAs(
  testator: PublicKey,
  beneficiary: PublicKey
) {
  const [will, willBump] = getWillPDA(testator, beneficiary);
  const [vault, vaultBump] = getVaultPDA(will);
  const [config, configBump] = getGlobalConfigPDA();
  const [feeVault, feeVaultBump] = getFeeVaultPDA();
  
  return {
    will,
    vault,
    config,
    feeVault,
    bumps: {
      will: willBump,
      vault: vaultBump,
      config: configBump,
      feeVault: feeVaultBump
    }
  };
}
