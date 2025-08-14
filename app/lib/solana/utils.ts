import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { confirmTransaction } from "../../hooks/use-transaction";

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
