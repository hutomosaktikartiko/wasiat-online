use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Config {
    pub authority: Pubkey,         // admin program
    pub fee_vault: Pubkey,         // vault for fee collection
    pub token_fee_bps: u16,        // basis points for SOL and SPL token
    pub nft_fee_lamports: u64,     // flat fee for NFTs
    pub min_heartbeat_period: u32, // seconds
    pub max_heartbeat_period: u32, // seconds
    pub paused: bool,              // emergency pause
    pub bump: u8,                  // pda bump
    pub reserved: [u8; 32],        // reservsed space
}

impl Config {}
