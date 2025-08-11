use crate::{constants::*, error::AppError, state::Config};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct UpdateConfig<'info> {
    /// Authority that can update config
    #[account(mut)]
    pub authority: Signer<'info>,

    /// The program config account to be updated
    #[account(
        mut,
        seeds = [CONFIG_SEED.as_bytes()],
        bump = config.bump,
        constraint = config.authority == authority.key() @ AppError::Unauthorized,
    )]
    pub config: Account<'info, Config>,
}

pub fn handler(
    ctx: Context<UpdateConfig>,
    token_fee_bps: Option<u16>,
    nft_fee_lamports: Option<u64>,
    min_heartbeat_period: Option<u32>,
    max_heartbeat_period: Option<u32>,
    min_heartbeat_interval: Option<u32>,
    paused: Option<bool>,
) -> Result<()> {
    let config = &mut ctx.accounts.config;

    // Update fields if provided
    if let Some(token_fee_bps) = token_fee_bps {
        config.token_fee_bps = token_fee_bps;
    }

    if let Some(nft_fee_lamports) = nft_fee_lamports {
        config.nft_fee_lamports = nft_fee_lamports;
    }

    if let Some(min_heartbeat_period) = min_heartbeat_period {
        require!(
            min_heartbeat_period > 0,
            AppError::InvalidMinimumHeartbeatPeriod
        );
        config.min_heartbeat_period = min_heartbeat_period;
    }

    if let Some(max_heartbeat_period) = max_heartbeat_period {
        let min_period = config.min_heartbeat_period;
        require!(
            max_heartbeat_period > min_period,
            AppError::InvalidMaximumHeartbeatPeriod
        );
        config.max_heartbeat_period = max_heartbeat_period;
    }

    if let Some(min_heartbeat_interval) = min_heartbeat_interval {
        require!(
            min_heartbeat_interval > 0,
            AppError::InvalidMinimumHeartbeatInterval
        );
        config.min_heartbeat_interval = min_heartbeat_interval;
    }

    if let Some(paused) = paused {
        config.paused = paused;
    }

    Ok(())
}
