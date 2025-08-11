use anchor_lang::prelude::*;

/// PDA Seeds - for deterministic address generation
#[constant]
pub const CONFIG_SEED: &str = "config";
#[constant]
pub const WILL_SEED: &str = "will";
#[constant]
pub const VAULT_SEED: &str = "vault";
#[constant]
pub const FEE_VAULT_SEED: &str = "fee_vault";

/// Date - for parse seconds
#[constant]
pub const SECONDS_PER_MINUTE: u32 = 60;
#[constant]
pub const SECONDS_PER_HOUR: u32 = 60 * 60;
#[constant]
pub const SECONDS_PER_DAY: u32 = 24 * 60 * 60;
#[constant]
pub const SECONDS_PER_WEEK: u32 = 7 * 24 * 60 * 60;

/// Heartbeat
#[constant]
pub const MIN_HEARTBEAT_PERIOD: u32 = 1 * SECONDS_PER_DAY; // 1 day
#[constant]
pub const MIN_HEARTBEAT_INTERVAL: u32 = 60; // 1 minute

/// Trigger
#[constant]
pub const TRIGGER_GRACE_PERIOD: u32 = 300; // 5 minutes

/// Fee
#[constant]
pub const NFT_SERVICE_FEE_LAMPORTS: u64 = 1_000_000;

/// NFT
#[constant]
pub const NFT_AMOUNT: u32 = 1;
