use crate::{constants::*, error::AppError, state::*};
use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{transfer as token_transfer, Mint, Token, TokenAccount, Transfer as TokenTransfer},
};

#[derive(Accounts)]
pub struct DepositNft<'info> {
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
