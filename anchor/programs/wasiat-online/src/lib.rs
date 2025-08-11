pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("A4Gbd666j7Bha4d6w231iamWYBmSYuxA7KKe42VY4Prw");

#[program]
pub mod wasiat_online {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        fee: u16,
        min_heartbeat_interval: u32,
        max_heartbeat_interval: u32,
    ) -> Result<()> {
        initialize::handler(ctx, fee, min_heartbeat_interval, max_heartbeat_interval)
    }

    pub fn deposit_sol(ctx: Context<DepositSol>, amount: u64) -> Result<()> {
        deposit_sol::handler(ctx, amount)
    }

    pub fn deposit_spl_token(ctx: Context<DepositSplToken>, amount: u64) -> Result<()> {
        deposit_spl_token::handler(ctx, amount)
    }

    pub fn deposit_nft(ctx: Context<DepositNft>) -> Result<()> {
        deposit_nft::handler(ctx)
    }
}
