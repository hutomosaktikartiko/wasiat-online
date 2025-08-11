use anchor_lang::prelude::*;

#[error_code]
pub enum AppError {
    /// Mathematical errors
    #[msg("Mathematical overflow detected.")]
    Overflow,
    #[msg("Mathematical underflow detected.")]
    Underflow,
    #[msg("Invalid amount provided.")]
    InvalidAmount,

    /// Balance errors
    #[msg("Insufficient balance for operation.")]
    InsufficientBalance,
    #[msg("Zero balance not allowed.")]
    ZeroBalance,

    /// Authorization errors
    #[msg("Unauthorized access attempt.")]
    Unauthorized,

    /// Configuration errors
    #[msg("Minimum of heartbeat period must be greater than zero.")]
    InvalidMinimumHeartbeatPeriod,
    #[msg("Maximum of heartbeat period must be greater than minimum heartbeat period")]
    InvalidMaximumHeartbeatPeriod,
    #[msg("Minimum of heartbeat interval must be greater than zero.")]
    InvalidMinimumHeartbeatInterval,

    /// Heartbeat errors
    #[msg("Heartbeat period must be greater than zero.")]
    InvalidHeartbeatPeriod,
    #[msg("Heartbeat period is too short.")]
    HeartbeatPeriodTooShort,
    #[msg("Heartbeat sent too frequently. Please wait before sending another.")]
    HeartbeatTooFrequent,

    /// Program errors
    #[msg("Program is paused.")]
    ProgramPaused,

    /// Will status errors
    #[msg("Invalid will status for this operation.")]
    InvalidWillStatus,
    #[msg("Will has already expired. Heartbeat no longer effective.")]
    WillAlreadyExpired,

    /// NFT errors
    #[msg("NFT supply must be exactly 1.")]
    InvalidNftSupply,
    #[msg("NFT decimals must be 0.")]
    InvalidNftDecimals,
    #[msg("Testator does not own this NFT.")]
    NftNotOwned,

    /// Trigger errors
    #[msg("Will has not expired ye. Cannot trigger.")]
    WillNotExpired,
    #[msg("Will is still in grace period. Please wait.")]
    StillInGracePeriod,
    #[msg("Only active wills ca be triigered.")]
    CannotTriggerInactiveWill,

    /// Claim errors
    #[msg("No assets available to claim.")]
    NoAssetsToClaim,
    #[msg("Insufficient balance to cover fees.")]
    InsuffcientBalanceForFees,
    #[msg("No claimable amount after fees.")]
    NoClaimableAmount,
    #[msg("Will must triggered before claiming")]
    WillNotTriggered,

    /// Withdrawal errors
    #[msg("cannot withdraw after will has been triggered or claimed.")]
    CannotWithdrawAfterTriggered,
    #[msg("Will has already been withdrawn.")]
    AlreadyWithdrawn,
    #[msg("No assets available to withdraw.")]
    NoAssetsToWithdraw,
    #[msg("No withdrawable amount after rent exemption.")]
    NoWithdrawableAmount,
    #[msg("Insufficient balance for rent exemption.")]
    InsufficientBalanceForRent,
}
