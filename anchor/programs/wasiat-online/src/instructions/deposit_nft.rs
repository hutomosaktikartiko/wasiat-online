use crate::{constants::*, error::AppError, state::*};
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{transfer as token_transfer, Mint, Token, TokenAccount, Transfer as TokenTransfer},
};

#[derive(Accounts)]
pub struct DepositNft<'info> {
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
        constraint = will.testator == testator.key() @ AppError::Unauthorized,
    )]
    pub will: Account<'info, Will>,

    /// Nft mint (supply should be 1)
    #[account(
        constraint = nft_mint.supply == 1 @ AppError::InvalidNftSupply,
        constraint = nft_mint.decimals == 0 @ AppError::InvalidNftDecimals,
    )]
    pub nft_mint: Account<'info, Mint>,

    /// Testator's nft account (source)
    #[account(
        mut,
        associated_token::mint = nft_mint,
        associated_token::authority = testator,
        constraint = testator_nft_account.amount == 1 @ AppError::NftNotOwned,
    )]
    pub testator_nft_account: Account<'info, TokenAccount>,

    /// Vault's nft account (destination - create if needed)
    #[account(
        init_if_needed,
        payer = testator,
        associated_token::mint = nft_mint,
        associated_token::authority = vault,
    )]
    pub vault_nft_acount: Account<'info, TokenAccount>,

    /// Vault pda
    #[account(
        mut,
        seeds = [VAULT_SEED.as_bytes(), will.key().as_ref()],
        bump = will.vault_bump,
    )]
    pub vault: SystemAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

impl<'info> DepositNft<'info> {
    pub fn validate(&self) -> Result<()> {
        // validate will status
        require!(
            matches!(self.will.status, WillStatus::Created | WillStatus::Active),
            AppError::InvalidWillStatus,
        );

        Ok(())
    }
}

pub fn handler(ctx: Context<DepositNft>) -> Result<()> {
    // validate inputs
    ctx.accounts.validate()?;

    // transfer nft from testator to vault
    let nft_transfer_accounts = TokenTransfer {
        from: ctx.accounts.testator_nft_account.to_account_info(),
        to: ctx.accounts.vault_nft_acount.to_account_info(),
        authority: ctx.accounts.testator.to_account_info(),
    };

    let nft_transfer_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        nft_transfer_accounts,
    );

    token_transfer(nft_transfer_ctx, 1)?; // nft amount always = 1

    // update will status if first deposit
    let will = &mut ctx.accounts.will;
    if will.status == WillStatus::Created {
        will.status = WillStatus::Active
    }

    // update last_heartbeat
    let clock = Clock::get()?;
    will.last_heartbeat = clock.unix_timestamp;

    Ok(())
}
