use crate::{constants::*, error::AppError, state::*};
use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

#[derive(Accounts)]
pub struct ClaimSol<'info> {
    /// Beneficiary claiming SOL
    #[account(mut)]
    pub beneficiary: Signer<'info>,

    // Will account - must be triggered and beneficiary must match
    #[account(
        mut,
        constraint = will.status == WillStatus::Triggered || will.status == WillStatus::Claimed @ AppError::InvalidWillStatus,
        constraint = will.beneficiary == beneficiary.key() @ AppError::Unauthorized,
    )]
    pub will: Account<'info, Will>,

    /// Sol vault pda
    #[account(
        mut,
        seeds = [VAULT_SEED.as_bytes(), will.key().as_ref()],
        bump = will.vault_bump,
    )]
    pub vault: SystemAccount<'info>,

    /// Config for fee configuration
    #[account(
        seeds = [CONFIG_SEED.as_bytes()],
        bump,
        constraint = !config.paused @ AppError::ProgramPaused,
    )]
    pub config: Account<'info, Config>,

    /// Fee vault for service fees
    #[account(
        mut,
        seeds = [FEE_VAULT_SEED.as_bytes()],
        bump,
    )]
    pub fee_vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> ClaimSol<'info> {
    pub fn validate(&self) -> Result<()> {
        // validate sol vault balance
        let vault_balance = self.vault.lamports();
        require!(vault_balance > 0, AppError::NoAssetsToClaim);

        // validate enough balance for fees + transfer
        let mint_rent = Rent::get()?.minimum_balance(0);
        require!(
            vault_balance > mint_rent,
            AppError::InsuffcientBalanceForFees
        );

        Ok(())
    }
}

pub fn handler(ctx: Context<ClaimSol>) -> Result<()> {
    // validation inputs
    ctx.accounts.validate()?;

    let will = &mut ctx.accounts.will;
    let vault_balance = ctx.accounts.vault.lamports();

    // calculate service fee
    let token_fee_bps = ctx.accounts.config.token_fee_bps;
    let service_fee = (vault_balance as u128 * token_fee_bps as u128 / 10_000) as u64;
    let claimable_amount = vault_balance.saturating_sub(service_fee);

    // keep minimum rent in vault to prevent account closure
    let min_rent = Rent::get()?.minimum_balance(0);
    let final_claimable = claimable_amount.saturating_sub(min_rent);

    require!(final_claimable > 0, AppError::NoClaimableAmount);

    // pda signer seeds for vault
    let will_key = will.key();
    let vault_seeds = &[VAULT_SEED.as_bytes(), will_key.as_ref(), &[will.vault_bump]];
    let vault_signer_seeds = &[&vault_seeds[..]];

    // transfer service fee to fee vault
    if service_fee > 0 {
        let fee_transfer_accounts = Transfer {
            from: ctx.accounts.vault.to_account_info(),
            to: ctx.accounts.fee_vault.to_account_info(),
        };

        let fee_transfer_ctx = CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            fee_transfer_accounts,
            vault_signer_seeds,
        );

        transfer(fee_transfer_ctx, service_fee)?;
    }

    // transfer remaining SOL to beneficiary
    let claim_transfer_accounts = Transfer {
        from: ctx.accounts.vault.to_account_info(),
        to: ctx.accounts.beneficiary.to_account_info(),
    };

    let claim_transfer_ctx = CpiContext::new_with_signer(
        ctx.accounts.system_program.to_account_info(),
        claim_transfer_accounts,
        vault_signer_seeds,
    );

    transfer(claim_transfer_ctx, final_claimable)?;

    // update will status
    will.status = WillStatus::Claimed;

    Ok(())
}
