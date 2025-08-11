use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Config {
    pub authority: Pubkey,           // admin program
    pub fee_vault: Pubkey,           // vault for fee collection
    pub token_fee_bps: u16,          // basis points for SOL and SPL token
    pub nft_fee_lamports: u64,       // flat fee for NFTs
    pub min_heartbeat_period: u32,   // seconds - minimum will duration
    pub max_heartbeat_period: u32,   // seconds - maximum will duration
    pub min_heartbeat_interval: u32, // seconds - cooldown between heartbeats
    pub paused: bool,                // emergency pause
    pub bump: u8,                    // pda bump
    pub reserved: [u8; 28],          // reserved space (reduced from 32 to 28)
}

impl Config {}
