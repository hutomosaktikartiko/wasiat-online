use crate::{constants::*, error::AppError, state::*};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct TriggerWill<'info> {
    /// Kepper triggering will
    #[account(mut)]
    pub keeper: Signer<'info>,

    /// Will account that wants to trigger
    #[account(
        mut,
        constraint = will.status == WillStatus::Active @ AppError::InvalidWillStatus,
    )]
    pub will: Account<'info, Will>,

    /// Config account for validation
    #[account(
        seeds = [CONFIG_SEED.as_bytes()],
        bump,
        constraint = !config.paused @ AppError::ProgramPaused,
    )]
    pub config: Account<'info, Config>,
}

impl<'info> TriggerWill<'info> {
    pub fn validate(&self) -> Result<()> {
        let will = &self.will;
        let current_time = Clock::get()?.unix_timestamp;

        // validate if heartbeat period has actuallt expired
        let expiry_time = will.last_heartbeat + will.heartbeat_period as i64;
        require!(current_time >= expiry_time, AppError::WillNotExpired);

        // validate grace period to prevent edgse cases
        require!(
            current_time >= expiry_time + TRIGGER_GRACE_PERIOD as i64,
            AppError::StillInGracePeriod
        );

        Ok(())
    }
}

pub fn handler(ctx: Context<TriggerWill>) -> Result<()> {
    // validation inputs
    ctx.accounts.validate()?;

    let will = &mut ctx.accounts.will;
    let clock = Clock::get()?;

    // update will status to triggered
    will.status = WillStatus::Triggered;
    will.trigger_at = Some(clock.unix_timestamp);

    Ok(())
}
