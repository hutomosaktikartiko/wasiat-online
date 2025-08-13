import { PublicKey } from "@solana/web3.js";
import { MIN_SOL_AMOUNT, MAX_SOL_AMOUNT, MIN_HEARTBEAT_PERIOD, MAX_HEARTBEAT_PERIOD } from "./constants";

/**
 * Validate Solana address
 */
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate SOL amount
 */
export function isValidSOLAmount(amount: number): {
  isValid: boolean;
  error?: string;
} {
  if (isNaN(amount) || amount <= 0) {
    return {
      isValid: false,
      error: "Jumlah SOL harus lebih besar dari 0"
    };
  }
  
  if (amount < MIN_SOL_AMOUNT) {
    return {
      isValid: false,
      error: `Jumlah SOL minimum adalah ${MIN_SOL_AMOUNT} SOL`
    };
  }
  
  if (amount > MAX_SOL_AMOUNT) {
    return {
      isValid: false,
      error: `Jumlah SOL maksimum adalah ${MAX_SOL_AMOUNT} SOL`
    };
  }
  
  return { isValid: true };
}

/**
 * Validate heartbeat period
 */
export function isValidHeartbeatPeriod(seconds: number): {
  isValid: boolean;
  error?: string;
} {
  if (isNaN(seconds) || seconds <= 0) {
    return {
      isValid: false,
      error: "Periode heartbeat harus lebih besar dari 0"
    };
  }
  
  if (seconds < MIN_HEARTBEAT_PERIOD) {
    const minDays = Math.floor(MIN_HEARTBEAT_PERIOD / (24 * 60 * 60));
    return {
      isValid: false,
      error: `Periode heartbeat minimum adalah ${minDays} hari`
    };
  }
  
  if (seconds > MAX_HEARTBEAT_PERIOD) {
    const maxDays = Math.floor(MAX_HEARTBEAT_PERIOD / (24 * 60 * 60));
    return {
      isValid: false,
      error: `Periode heartbeat maksimum adalah ${maxDays} hari`
    };
  }
  
  return { isValid: true };
}

/**
 * Validate form data
 */
export function validateCreateWillForm(data: {
  beneficiary: string;
  heartbeatPeriod: number;
}): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  
  // Validate beneficiary address
  if (!data.beneficiary.trim()) {
    errors.beneficiary = "Alamat penerima manfaat wajib diisi";
  } else if (!isValidSolanaAddress(data.beneficiary.trim())) {
    errors.beneficiary = "Alamat Solana tidak valid";
  }
  
  // Validate heartbeat period
  const heartbeatValidation = isValidHeartbeatPeriod(data.heartbeatPeriod);
  if (!heartbeatValidation.isValid) {
    errors.heartbeatPeriod = heartbeatValidation.error!;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
