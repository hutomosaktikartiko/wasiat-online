use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct VaultRegistry {
    pub vault: Pubkey,
    #[max_len(100)]
    pub assets: Vec<Pubkey>,
    pub bump: u8,
}