// Migrations are an early feature. Currently, they're nothing more than this
// single deploy script that's invoked from the CLI, injecting a provider
// configured from the workspace's Anchor.toml.

const anchor = require("@coral-xyz/anchor");
const { PublicKey, SystemProgram } = require("@solana/web3.js");

async function deploy() {
  console.log("Starting deployment script...");
  
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  
  const program = anchor.workspace.WasiatOnline;
  const authority = provider.wallet.publicKey;
  
  console.log("Program ID:", program.programId.toString());
  console.log("Authority:", authority.toString());
  
  // Derive PDAs
  const [configPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("config")],
    program.programId
  );
  
  const [feeVaultPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("fee_vault")],
    program.programId
  );
  
  // Initialize parameters
  const tokenFeeBps = 250; // 2.5%
  const nftFeeLamports = new anchor.BN(1000000); // 0.001 SOL
  const minHeartbeatPeriod = 60 * 24 * 30; // 30 days
  const maxHeartbeatPeriod = 3 * 365 * 24 * 60 * 60; // 3 years
  const minHeartbeatInterval = 60; // 1 minute
  
  try {
    const tx = await program.methods
      .initialize(tokenFeeBps, nftFeeLamports, minHeartbeatPeriod, maxHeartbeatPeriod, minHeartbeatInterval)
      .accounts({
        authority: authority,
        config: configPda,
        feeVault: feeVaultPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
      
    console.log("Initialize successful:", tx);
    console.log("Authority:", authority.toString());
    console.log("Config PDA:", configPda.toString());
    console.log("Fee Vault PDA:", feeVaultPda.toString());
  } catch (error) {
    if (error.message.includes("already in use")) {
      console.log("Config already initialized - deployment complete");
    } else {
      console.error("Initialize failed:", error);
      throw error;
    }
  }
}

deploy().catch(console.error);