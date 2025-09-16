use crate::{constants::*, error::AppError, state::*};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(beneficiary: Pubkey, heartbeat_period: u32)]
pub struct CreateWill<'info> {
    /// User creating will
    #[account(mut)]
    pub testator: Signer<'info>,

    /// Config account for validation
    #[account(
        seeds = [CONFIG_SEED.as_bytes()],
        bump
    )]
    pub config: Account<'info, Config>,

    /// Will account
    #[account(
        init,
        payer = testator,
        space = DISCRIMATOR_SIZE as usize + Will::INIT_SPACE,
        seeds = [
            WILL_SEED.as_bytes(),
            testator.key().as_ref(),
            beneficiary.as_ref(),
        ],
        bump,
    )]
    pub will: Account<'info, Will>,

    /// Vault for sol
    #[account(
        init,
        payer = testator,
        space = DISCRIMATOR_SIZE as usize + Vault::INIT_SPACE,
        seeds = [VAULT_SEED.as_bytes(), will.key().as_ref()],
        bump,
    )]
    pub vault: Account<'info, Vault>,

    /// Vault for other assets
    #[account(
        init,
        payer = testator,
        space = DISCRIMATOR_SIZE as usize + VaultRegistry::INIT_SPACE,
        seeds = [
            VAULT_REGISTRY_SEED.as_bytes(),
            will.key().as_ref(),
        ],
        bump,
    )]
    pub vault_registry: Account<'info, VaultRegistry>,

    pub system_program: Program<'info, System>,
}

impl<'info> CreateWill<'info> {
    pub fn validate(&self, heartbeat_period: u32) -> Result<()> {
        let config = &self.config;

        // validate heartbeart period range
        require!(
            heartbeat_period >= config.min_heartbeat_period,
            AppError::HeartbeatPeriodTooShort
        );

        // program not paused
        require!(!config.paused, AppError::ProgramPaused);

        Ok(())
    }
}

pub fn handler(ctx: Context<CreateWill>, beneficiary: Pubkey, heartbeat_period: u32) -> Result<()> {
    // validate inputs
    ctx.accounts.validate(heartbeat_period)?;

    let will = &mut ctx.accounts.will;
    let clock = Clock::get()?;

    // set will data
    will.testator = ctx.accounts.testator.key();
    will.beneficiary = beneficiary;
    will.vault = ctx.accounts.vault.key();
    will.vault_registry = ctx.accounts.vault_registry.key();
    will.heartbeat_period = heartbeat_period;
    will.status = WillStatus::Created;
    will.created_at = clock.unix_timestamp;
    will.last_heartbeat = clock.unix_timestamp;
    will.trigger_at = None;
    will.bump = ctx.bumps.will;
    will.reserved = [0; 72];

    // set vault
    let vault = &mut ctx.accounts.vault;
    vault.will = ctx.accounts.will.key();
    vault.bump = ctx.bumps.vault;

    // set vault registry
    let vault_registry = &mut ctx.accounts.vault_registry;
    vault_registry.vault = ctx.accounts.vault.key();
    vault_registry.assets = Vec::new();
    vault_registry.bump = ctx.bumps.vault_registry;

    Ok(())
}
