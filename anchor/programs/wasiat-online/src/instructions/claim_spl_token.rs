use crate::{constants::*, error::AppError, state::*};
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{transfer as token_transfer, Mint, Token, TokenAccount, Transfer as TokenTransfer},
};

#[derive(Accounts)]
pub struct ClaimSplToken<'info> {
    /// Beneficiary claiming spl token
    #[account(mut)]
    pub beneficiary: Signer<'info>,

    /// Will account - must be triggered and beneficiary must match
    #[account(
        mut,
        constraint = will.status == WillStatus::Triggered @ AppError::InvalidWillStatus,
        constraint = will.beneficiary == beneficiary.key() @ AppError::Unauthorized,
    )]
    pub will: Account<'info, Will>,

    /// Token mint
    pub mint: Account<'info, Mint>,

    /// Vault's token account (before)
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = vault,
        constraint = vault_token_account.amount > 0 @AppError::NoAssetsToClaim,
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    /// Beneficiary's token account (destination - create if needed)
    #[account(
        init_if_needed,
        payer = beneficiary,
        associated_token::mint = mint,
        associated_token::authority = beneficiary,
    )]
    pub beneficiary_token_account: Account<'info, TokenAccount>,

    /// Fee vault's token account (for service fees)
    #[account(
        init_if_needed,
        payer = beneficiary,
        associated_token::mint = mint,
        associated_token::authority = fee_vault_pda
    )]
    pub fee_vault_token_account: Account<'info, TokenAccount>,

    /// Vault pda (authority for vault_token_account)
    #[account(
        seeds = [VAULT_SEED.as_bytes(), will.key().as_ref()],
        bump = will.vault_bump,
    )]
    pub vault: SystemAccount<'info>,

    /// Fee vault pda (authority for fee_vault_token_account)
    #[account(
        seeds = [VAULT_SEED.as_bytes()],
        bump,
    )]
    pub fee_vault_pda: SystemAccount<'info>,

    /// Config - fee configuration and validate program paused
    #[account(
        seeds = [CONFIG_SEED.as_bytes()],
        bump,
        constraint = !config.paused @ AppError::ProgramPaused,
    )]
    pub config: Account<'info, Config>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<ClaimSplToken>) -> Result<()> {
    let will = &mut ctx.accounts.will;
    let total_amount = ctx.accounts.vault_token_account.amount;

    // calculate service fee
    let token_fee_bps = ctx.accounts.config.token_fee_bps;
    let service_fee = (total_amount as u128 * token_fee_bps as u128 / 10_000) as u64;
    let claimable_amount = total_amount.saturating_sub(service_fee);

    // prepare pda signer seeds
    let will_key = will.key();
    let vault_seeds = &[VAULT_SEED.as_bytes(), will_key.as_ref(), &[will.vault_bump]];
    let vault_signer_seeds = &[&vault_seeds[..]];

    // transfer service fee to fee vault
    if service_fee > 0 {
        let fee_transfer_accounts = TokenTransfer {
            from: ctx.accounts.vault_token_account.to_account_info(),
            to: ctx.accounts.fee_vault_token_account.to_account_info(),
            authority: ctx.accounts.vault.to_account_info(),
        };

        let fee_transfer_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            fee_transfer_accounts,
            vault_signer_seeds,
        );

        token_transfer(fee_transfer_ctx, service_fee)?;
    }

    // transfer tokens to beneficiary
    let claim_transfer_accounts = TokenTransfer {
        from: ctx.accounts.vault_token_account.to_account_info(),
        to: ctx.accounts.beneficiary_token_account.to_account_info(),
        authority: ctx.accounts.vault.to_account_info(),
    };

    let claim_transfer_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        claim_transfer_accounts,
        vault_signer_seeds,
    );

    token_transfer(claim_transfer_ctx, claimable_amount)?;

    Ok(())
}
