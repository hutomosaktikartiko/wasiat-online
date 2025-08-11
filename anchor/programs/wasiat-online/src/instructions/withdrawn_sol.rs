use crate::{constants::*, error::AppError, state::*};
use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

#[derive(Accounts)]
pub struct WithdrawSol<'info> {
    /// Testator withdrawing SOL
    #[account(mut)]
    pub testator: Signer<'info>,

    /// Will account - must be owner by testator and NOT triggered/claimed
    #[account(
        mut,
        constraint = will.testator == testator.key() @ AppError::Unauthorized,
        constraint = will.status != WillStatus::Triggered @ AppError::CannotWithdrawAfterTriggered,
        constraint = will.status != WillStatus::Claimed @ AppError::CannotWithdrawAfterTriggered,
        constraint = will.status != WillStatus::Withdrawn @ AppError::AlreadyWithdrawn,
    )]
    pub will: Account<'info, Will>,

    /// Sol vault PDA (source)
    #[account(
        mut,
        seeds = [VAULT_SEED.as_bytes(), will.key().as_ref()],
        bump = will.vault_bump,
    )]
    pub vault: SystemAccount<'info>,

    /// Config for validation
    #[account(
        seeds = [CONFIG_SEED.as_bytes()],
        bump,
        constraint = !config.paused @ AppError::ProgramPaused,
    )]
    pub config: Account<'info, Config>,

    pub system_program: Program<'info, System>,
}

impl<'info> WithdrawSol<'info> {
    pub fn validate(&self) -> Result<()> {
        // validate vault has sol
        let vault_balance = self.vault.lamports();
        require!(vault_balance > 0, AppError::NoAssetsToWithdraw);

        // validate balance for rent exemption
        let mint_rent = Rent::get()?.minimum_balance(9);
        require!(
            vault_balance > mint_rent,
            AppError::InsufficientBalanceForRent
        );

        // validate withdrawable amount
        let withdrawable_amount = vault_balance.saturating_sub(mint_rent);
        require!(withdrawable_amount > 0, AppError::NoWithdrawableAmount);

        Ok(())
    }
}

pub fn handler(ctx: Context<WithdrawSol>) -> Result<()> {
    // validations
    ctx.accounts.validate()?;

    let will = &mut ctx.accounts.will;

    // prepare pda signer seeds for vault
    let will_key = will.key();
    let vault_seeds = &[VAULT_SEED.as_bytes(), will_key.as_ref(), &[will.vault_bump]];
    let vault_signer_seeds = &[&vault_seeds[..]];

    // transfer sol from vault to testator
    let withdraw_transfer_account = Transfer {
        from: ctx.accounts.vault.to_account_info(),
        to: ctx.accounts.testator.to_account_info(),
    };

    let withdraw_transfer_ctx = CpiContext::new_with_signer(
        ctx.accounts.system_program.to_account_info(),
        withdraw_transfer_account,
        vault_signer_seeds,
    );

    let vault_balance = ctx.accounts.vault.lamports();
    let min_rent = Rent::get()?.minimum_balance(0);
    let withdrawable_amount = vault_balance.saturating_sub(min_rent);

    transfer(withdraw_transfer_ctx, withdrawable_amount)?;

    Ok(())
}
