import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

/**
 * Get SOL balance for a public key
 */
export async function getSOLBalance(
  connection: Connection,
  publicKey: PublicKey
): Promise<number> {
  try {
    const balance = await connection.getBalance(publicKey);
    
    return balance;
  } catch (error) {
    console.error("Error getting SOL balance:", error);
    // Jangan loop: tetap return 0 tanpa setState di pemanggil
    return 0;
  }
}

/**
 * Wait for transaction confirmation
 */
export async function confirmTransaction(
  connection: Connection,
  signature: string,
  timeout = 60000
): Promise<boolean> {
  try {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const result = await connection.getSignatureStatus(signature);
      
      if (result.value) {
        if (result.value.err) {
          throw new Error(`Transaction failed: ${result.value.err}`);
        }
        if (result.value.confirmationStatus === "confirmed" || result.value.confirmationStatus === "finalized") {
          return true;
        }
      }
      
      // Wait 1 second before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    throw new Error("Transaction confirmation timeout");
  } catch (error) {
    console.error("Error confirming transaction:", error);
    return false;
  }
}

/**
 * Airdrop SOL for testing (devnet only)
 */
export async function airdropSOL(
  connection: Connection,
  publicKey: PublicKey,
  amount = 1
): Promise<string> {
  try {
    const signature = await connection.requestAirdrop(
      publicKey,
      amount * LAMPORTS_PER_SOL
    );
    
    await confirmTransaction(connection, signature);
    return signature;
  } catch (error) {
    console.error("Error requesting airdrop:", error);
    throw error;
  }
}
