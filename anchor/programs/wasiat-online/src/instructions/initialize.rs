use crate::{constants::*, error::AppError, state::Config};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(fee: u16, min_heartbeat_period: u32, max_heartbeat_period: u32)]
pub struct Initialize<'info> {
    /// Aurhority that can initialize
    #[account(mut)]
    pub authority: Signer<'info>,

    /// The program config account to be created
    #[account(
        init,
        payer = authority,
        space = 8 + Config::INIT_SPACE,
        seeds = [CONFIG_SEED.as_bytes()],
        bump
    )]
    pub config: Account<'info, Config>,

    /// Vault pda for fee collection
    #[account(
        mut,
        seeds = [FEE_VAULT_SEED.as_bytes()],
        bump
    )]
    pub fee_vault: SystemAccount<'info>,

    /// System program
    pub system_program: Program<'info, System>,
}

impl<'info> Initialize<'info> {
    pub fn validate(&self, min_heartbeat_period: u32, max_heartbeat_period: u32) -> Result<()> {
        // validate heartbeat period
        require!(
            min_heartbeat_period > 0,
            AppError::InvalidMinimumHeartbeatPeriod
        );
        require!(
            max_heartbeat_period > min_heartbeat_period,
            AppError::InvalidMaximumHeartbeatPeriod
        );

        Ok(())
    }
}

pub fn handler(
    ctx: Context<Initialize>,
    token_fee_bps: u16,
    nft_fee_lamports: u64,
    min_heartbeat_period: u32,
    max_heartbeat_period: u32,
) -> Result<()> {
    // validate inputs
    ctx.accounts
        .validate(min_heartbeat_period, max_heartbeat_period)?;

    let config = &mut ctx.accounts.config;

    // set initial values
    config.authority = ctx.accounts.authority.key();
    config.fee_vault = ctx.accounts.fee_vault.key();
    config.token_fee_bps = token_fee_bps;
    config.nft_fee_lamports = nft_fee_lamports;
    config.min_heartbeat_period = min_heartbeat_period;
    config.max_heartbeat_period = max_heartbeat_period;
    config.paused = false;
    config.bump = ctx.bumps.config;
    config.reserved = [0; 32];

    Ok(())
}
