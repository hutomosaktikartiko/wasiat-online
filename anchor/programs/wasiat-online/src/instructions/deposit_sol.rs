use crate::{constants::*, error::AppError, state::*};
use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

#[derive(Accounts)]
pub struct DepositSol<'info> {
    /// Testator depositing SOL
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
        constraint = will.testator == testator.key() @ AppError::Unauthorized,
    )]
    pub will: Account<'info, Will>,

    /// Vault pda for saving SOL
    #[account(
        mut,
        seeds = [VAULT_SEED.as_bytes(), will.key().as_ref()],
        bump = will.vault_bump,
    )]
    pub vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> DepositSol<'info> {
    pub fn validate(&self, amount: u64) -> Result<()> {
        // validate amount
        require!(amount > 0, AppError::InvalidAmount);

        // will must be in correct status
        require!(
            matches!(self.will.status, WillStatus::Created | WillStatus::Active),
            AppError::InvalidWillStatus,
        );

        // check testator has enough balance (plus rent exemption)
        let min_rent = Rent::get()?.minimum_balance(0);
        let testator_balance = self.testator.lamports();
        require!(
            testator_balance >= amount + min_rent,
            AppError::InsufficientBalance
        );

        Ok(())
    }
}

pub fn handler(ctx: Context<DepositSol>, amount: u64) -> Result<()> {
    // validate inputs
    ctx.accounts.validate(amount)?;

    // transfer SOL from testator to vault
    let transfer_accounts = Transfer {
        from: ctx.accounts.testator.to_account_info(),
        to: ctx.accounts.vault.to_account_info(),
    };

    let transfer_ctx = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        transfer_accounts,
    );

    transfer(transfer_ctx, amount)?;

    // update will status if first deposit
    let will = &mut ctx.accounts.will;
    if will.status == WillStatus::Created {
        will.status = WillStatus::Active;
    }

    // update last_heartbeat
    let clock = Clock::get()?;
    will.last_heartbeat = clock.unix_timestamp;

    Ok(())
}
