use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Will {
    // identifiers
    pub testator: Pubkey,
    pub beneficiary: Pubkey,
    pub vault: Pubkey, // pda for sol
    pub vault_registry: Pubkey, // pda for other assets (e.g nft and spl tokens)

    // configurations
    pub heartbeat_period: u32, // seconds

    // status & timing
    pub status: WillStatus,
    pub created_at: i64,         // timestamp
    pub last_heartbeat: i64,     // timestamp
    pub trigger_at: Option<i64>, // timestamp

    // metadata
    pub bump: u8,       // pda bump

    // reserved for future upgrades
    pub reserved: [u8; 72], // reserved space
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum WillStatus {
    Created,   // 0 - newly created, no assets
    Active,    // 1 - assets present, heartbeat active
    Triggered, // 2 - timer runs out, can be claimed
    Claimed,   // 3 - already claimed by beneficiary
    Withdrawn, // 4 - assets withdrawn by testator
}
