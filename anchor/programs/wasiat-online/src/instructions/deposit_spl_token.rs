use crate::{constants::*, error::AppError, state::*};
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{transfer as token_transfer, Mint, Token, TokenAccount, Transfer as TokenTransfer},
};

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct DepositSplToken<'info> {
    /// Testator depositing SOL
    #[account(mut)]
    pub testator: Signer<'info>,

    /// Will account - mus be owned by testator
    #[account(
        mut,
        seeds = [
            WILL_SEED.as_bytes(),
            testator.key().as_ref(),
            will.beneficiary.as_ref()
        ],
        bump = will.bump,
        constraint = will.status == WillStatus::Created || will.status == WillStatus::Active @ AppError::InvalidWillStatus,
        constraint = will.testator == testator.key() @ AppError::Unauthorized,
    )]
    pub will: Account<'info, Will>,

    /// Token mint
    pub mint: Account<'info, Mint>,

    /// Testator's token account (source)
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = testator,
        constraint = testator_token_account.amount >= amount @ AppError::InsufficientBalance,
    )]
    pub testator_token_account: Account<'info, TokenAccount>,

    /// Vault's token account (destination - create if needed)
    #[account(
        init_if_needed,
        payer = testator,
        associated_token::mint = mint,
        associated_token::authority = vault,
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    /// CHECK: PDA vault as authority
    #[account(
        seeds = [VAULT_SEED.as_bytes(), will.key().as_ref()],
        bump,
    )]
    pub vault: Account<'info, Vault>,

    /// Vault registry
    #[account(
        mut,
        seeds = [
            VAULT_REGISTRY_SEED.as_bytes(),
            vault.key().as_ref()
        ],
        bump,
        constraint = vault_registry.vault.key() == vault.key() @ AppError::Unauthorized
    )]
    pub vault_registry:  Account<'info, VaultRegistry>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

impl<'info> DepositSplToken<'info> {
    pub fn validate(&self, amount: u64) -> Result<()> {
        // validate amount
        require!(amount > 0, AppError::InvalidAmount);

        Ok(())
    }
}

pub fn handler(ctx: Context<DepositSplToken>, amount: u64) -> Result<()> {
    // validate inputs
    ctx.accounts.validate(amount)?;

    // transfer spl token from testator to vault
    let token_transfer_accounts = TokenTransfer {
        from: ctx.accounts.testator_token_account.to_account_info(),
        to: ctx.accounts.vault_token_account.to_account_info(),
        authority: ctx.accounts.testator.to_account_info(),
    };

    let token_transfer_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        token_transfer_accounts,
    );

    token_transfer(token_transfer_ctx, amount)?;

    let vault_registry = &mut ctx.accounts.vault_registry;

    // add mint to vault registry's assets if don't have it
    if !vault_registry.assets.contains(&ctx.accounts.mint.key()) {
        vault_registry.assets.push(ctx.accounts.mint.key());
    }

    // update will status if first deposit
    let will = &mut ctx.accounts.will;
    if will.status == WillStatus::Created {
        will.status = WillStatus::Active;
    }

    // update last_hearbeat
    let clock = Clock::get()?;
    will.last_heartbeat = clock.unix_timestamp;

    Ok(())
}
