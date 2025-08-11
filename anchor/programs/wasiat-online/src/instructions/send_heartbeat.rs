use crate::{constants::*, error::AppError, state::*};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct SendHeartbeat<'info> {
    /// Testator sending heartbeat
    pub testator: Signer<'info>,

    /// Config account for validation
    #[account(
        seeds = [CONFIG_SEED.as_bytes()],
        bump
    )]
    pub config: Account<'info, Config>,

    /// Will account - must be owned by testator and in active status
    #[account(
        mut,
        seeds = [
            WILL_SEED.as_bytes(),
            testator.key().as_ref(),
            will.beneficiary.as_ref(),
        ],
        bump = will.bump,
        constraint = will.testator == testator.key() @ AppError::Unauthorized,
        constraint = will.status == WillStatus::Active @ AppError::InvalidWillStatus,
    )]
    pub will: Account<'info, Will>,
}

impl<'info> SendHeartbeat<'info> {
    pub fn validate(&self) -> Result<()> {
        let will = &self.will;
        let config = &self.config;
        let current_time = Clock::get()?.unix_timestamp;

        // validate prevent spam heartbeats (cooldown period)
        let time_since_last = current_time - will.last_heartbeat;
        require!(
            time_since_last >= config.min_heartbeat_interval as i64,
            AppError::HeartbeatPeriodTooShort
        );

        // validate if heartbeat is still meaningful (not expired)
        let expiry_time = will.last_heartbeat + will.heartbeat_period as i64;
        require!(current_time < expiry_time, AppError::WillAlreadyExpired);

        Ok(())
    }
}

pub fn handler(ctx: Context<SendHeartbeat>) -> Result<()> {
    // validate inputs
    ctx.accounts.validate()?;

    let will = &mut ctx.accounts.will;
    let clock = Clock::get()?;

    // update heartbeat timestamp
    will.last_heartbeat = clock.unix_timestamp;

    Ok(())
}
