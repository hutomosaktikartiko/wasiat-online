use crate::{constants::*, error::AppError, state::*};
use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{transfer as token_transfer, Mint, Token, TokenAccount, Transfer as TokenTransfer},
};

#[derive(Accounts)]
pub struct ClaimNft<'info> {
    /// Beneficiary claiming NFT
    #[account(mut)]
    pub beneficiary: Signer<'info>,

    /// Will account - must be triggered and beneficiary must match
    #[account(
        mut,
        constraint = will.status == WillStatus::Triggered @ AppError::InvalidWillStatus,
        constraint = will.beneficiary == beneficiary.key() @ AppError::Unauthorized,
    )]
    pub will: Account<'info, Will>,

    /// Nft min (supply should be 1)
    #[account(
        constraint = nft_mint.supply == 1 @ AppError::InvalidNftSupply,
        constraint = nft_mint.decimals == 0 @ AppError::InvalidNftDecimals,
    )]
    pub nft_mint: Account<'info, Mint>,

    /// Vault's nft account (source)
    #[account(
        mut,
        associated_token::mint = nft_mint,
        associated_token::authority = vault,
        constraint = vault_nft_account.amount == 1 @ AppError::NoAssetsToClaim,
    )]
    pub vault_nft_account: Account<'info, TokenAccount>,

    /// Beneficiary's nft account (destination - create if needed)
    #[account(
        init_if_needed,
        payer = beneficiary,
        associated_token::mint = nft_mint,
        associated_token::authority = beneficiary
    )]
    pub beneficiary_nft_account: Account<'info, TokenAccount>,

    /// Vault pda (authority for vault_nft_account)
    #[account(
        seeds = [VAULT_SEED.as_bytes(), will.key().as_ref()],
        bump = will.vault_bump,
    )]
    pub vault: SystemAccount<'info>,

    /// Config for fee calculation
    #[account(
        seeds = [CONFIG_SEED.as_bytes()],
        bump,
        constraint = !config.paused @ AppError::ProgramPaused,
    )]
    pub config: Account<'info, Config>,

    /// Fee vault for collection SOL fees (nft fee in sol)
    #[account(
        mut,
        seeds = [FEE_VAULT_SEED.as_bytes()],
        bump,
    )]
    pub fee_vault: SystemAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

impl<'info> ClaimNft<'info> {
    pub fn validate(&self) -> Result<()> {
        // validate beneficiary SOL for fee
        let nft_fee = self.config.nft_fee_lamports;
        if nft_fee > 0 {
            let beneficiary_balance = self.beneficiary.lamports();
            let mint_rent = Rent::get()?.minimum_balance(0);
            require!(
                beneficiary_balance >= nft_fee + mint_rent,
                AppError::InsuffcientBalanceForFees
            );
        }

        Ok(())
    }
}

pub fn handler(ctx: Context<ClaimNft>) -> Result<()> {
    // validations
    ctx.accounts.validate()?;

    let will = &mut ctx.accounts.will;
    let config = &ctx.accounts.config;

    // prepare pda signer seed for vault
    let will_key = will.key();
    let vault_seeds = &[VAULT_SEED.as_bytes(), will_key.as_ref(), &[will.vault_bump]];
    let vault_signer_seeds = &[&vault_seeds[..]];

    // transfer service fee from beneficiary to fee vault
    let nft_service_fee = config.nft_fee_lamports;
    if nft_service_fee > 0 {
        let fee_transfer_account = Transfer {
            from: ctx.accounts.beneficiary.to_account_info(),
            to: ctx.accounts.fee_vault.to_account_info(),
        };

        let fee_transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            fee_transfer_account,
        );

        transfer(fee_transfer_ctx, nft_service_fee)?;
    }

    // transfer nft from vault to beneficiary
    let nft_transfer_account = TokenTransfer {
        from: ctx.accounts.vault_nft_account.to_account_info(),
        to: ctx.accounts.beneficiary_nft_account.to_account_info(),
        authority: ctx.accounts.vault.to_account_info(),
    };

    let nft_transfer_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        nft_transfer_account,
        vault_signer_seeds,
    );

    token_transfer(nft_transfer_ctx, NFT_AMOUNT as u64)?;

    Ok(())
}
