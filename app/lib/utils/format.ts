import { LAMPORTS_PER_SOL } from "./constants";
import { formatDistanceToNow, format } from "date-fns";
import { id } from "date-fns/locale";

/**
 * Format lamports to SOL with specified decimal places
 */
export function formatSOL(lamports: number, decimals = 4): string {
  return (lamports / LAMPORTS_PER_SOL).toFixed(decimals);
}

/**
 * Convert SOL to lamports
 */
export function solToLamports(sol: number): number {
  return Math.floor(sol * LAMPORTS_PER_SOL);
}

/**
 * Format PublicKey to shortened address
 */
export function formatAddress(address: string, length = 4): string {
  if (!address) return "";
  if (address.length <= length * 2) return address;
  
  return `${address.slice(0, length)}...${address.slice(-length)}`;
}

/**
 * Format timestamp to relative time
 */
export function formatTimeAgo(timestamp: number): string {
  return formatDistanceToNow(new Date(timestamp * 1000), {
    addSuffix: true,
    locale: id
  });
}

/**
 * Format timestamp to readable date
 */
export function formatDate(timestamp: number): string {
  return format(new Date(timestamp * 1000), "dd MMM yyyy HH:mm", {
    locale: id
  });
}

/**
 * Format heartbeat period to human readable
 */
export function formatHeartbeatPeriod(seconds: number): string {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  
  if (days > 0) {
    return hours > 0 ? `${days} hari ${hours} jam` : `${days} hari`;
  }
  
  return `${hours} jam`;
}

/**
 * Format transaction signature for display
 */
export function formatSignature(signature: string): string {
  return formatAddress(signature, 8);
}
