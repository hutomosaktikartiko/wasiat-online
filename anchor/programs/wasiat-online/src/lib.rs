pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("6rs8fcHe8R5xFM56LyaEHGnxjt5QQcrVZWsMbDphQpe4");

#[program]
pub mod wasiat_online {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        token_fee_bps: u16,
        nft_fee_lamports: u64,
        min_heartbeat_period: u32,
        max_heartbeat_period: u32,
        min_heartbeat_interval: u32,
    ) -> Result<()> {
        initialize::handler(
            ctx,
            token_fee_bps,
            nft_fee_lamports,
            min_heartbeat_period,
            max_heartbeat_period,
            min_heartbeat_interval,
        )
    }

    pub fn create_will(
        ctx: Context<CreateWill>,
        beneficiary: Pubkey,
        heartbeat_period: u32,
    ) -> Result<()> {
        create_will::handler(ctx, beneficiary, heartbeat_period)
    }

    pub fn deposit_sol(ctx: Context<DepositSol>, amount: u64) -> Result<()> {
        deposit_sol::handler(ctx, amount)
    }

    pub fn send_heartbeat(ctx: Context<SendHeartbeat>) -> Result<()> {
        send_heartbeat::handler(ctx)
    }

    pub fn trigger_will(ctx: Context<TriggerWill>) -> Result<()> {
        trigger_will::handler(ctx)
    }

    pub fn claim_sol(ctx: Context<ClaimSol>) -> Result<()> {
        claim_sol::handler(ctx)
    }

    pub fn withdraw_sol(ctx: Context<WithdrawSol>) -> Result<()> {
        withdraw_sol::handler(ctx)
    }

    pub fn update_config(
        ctx: Context<UpdateConfig>,
        token_fee_bps: Option<u16>,
        nft_fee_lamports: Option<u64>,
        min_heartbeat_period: Option<u32>,
        max_heartbeat_period: Option<u32>,
        min_heartbeat_interval: Option<u32>,
        paused: Option<bool>,
    ) -> Result<()> {
        update_config::handler(
            ctx,
            token_fee_bps,
            nft_fee_lamports,
            min_heartbeat_period,
            max_heartbeat_period,
            min_heartbeat_interval,
            paused,
        )
    }
}
