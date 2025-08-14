# Database Schema

Complete documentation of data structures for on-chain (Solana Program) and off-chain (SQLite) components.

## On-Chain Schema (Solana Program)

### Will Account Structure

```rust
#[account]
pub struct Will {
    // Identifiers
    pub testator: Pubkey,
    pub beneficiary: Pubkey,
    pub vault: Pubkey,              // PDA vault for assets

    // Configuration
    pub heartbeat_period: i64,      // seconds

    // Status & Timing
    pub status: WillStatus,         // 1 byte
    pub created_at: i64,            // timestamp
    pub last_heartbeat: i64,        // timestamp
    pub triggered_at: Option<i64>,  // Ttimestamp

    // Metadata
    pub bump: u8,                   // PDA bump
    pub vault_bump: u8,             // vault PDA bump

    // Reserved untuk future upgrades
    pub reserved: [u8; 64],         // reserved space
}
// Total: ~200 bytes per will account
```

### Will Status Enum

```rust
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum WillStatus {
    Created,    // 0 - Just created, no assets yet
    Active,     // 1 - Assets present, heartbeat active
    Triggered,  // 2 - Timer runs out, can be claimed
    Claimed,    // 3 - Already claimed beneficiary
    Withdrawn,  // 4 - Assets withdrawn by testator
}
```

### Global Config Account

```rust
#[account]
pub struct GlobalConfig {
    pub authority: Pubkey,
    pub fee_vault: Pubkey,          // vault for fee collection
    pub token_fee_bps: u16,         // fee in basis points for SOL and SPL token
    pub nft_fee_lamports: u64,      // flat fee for NFTs
    pub min_heartbeat_period: u32,
    pub max_heartbeat_period: u32,
    pub paused: bool,               // emergency pause
    pub bump: u8,                   // PDA bump
    pub reserved: [u8; 32],         // reserved
}
```

### PDA Seeds

```rust
// Will Account PDA: ["will", testator.key(), beneficiary.key()]
// Vault PDA: ["vault", will_account.key()]
// Global Config PDA: ["config"]
// Fee Vault PDA: ["fee_vault"]
```

### Account Relationships

```
GlobalConfig
├── authority (Pubkey)
└── fee_vault (Pubkey) → FeeVault PDA

Will
├── testator (Pubkey) → User wallet
├── beneficiary (Pubkey) → User wallet
├── vault (Pubkey) → Vault PDA
└── status (WillStatus enum)

Vault PDA
├── Associated with Will account
└── Stores: SOL, SPL Tokens, NFTs
```

## Off-chain Schema (SQLite)

### Heartbeat Tracking

```sql
CREATE TABLE heartbeat_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    will_pubkey TEXT NOT NULL,
    testator_pubkey TEXT NOT NULL,
    heartbeat_timestamp INTEGER NOT NULL,
    tx_signature TEXT NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_heartbeat_will ON heartbeat_logs(will_pubkey);
CREATE INDEX idx_heartbeat_timestamp ON heartbeat_logs(heartbeat_timestamp);
```

**Purpose**: Track heartbeat history for analytics and debugging

### Will Status Tracking

```sql
CREATE TABLE will_status_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    will_pubkey TEXT NOT NULL,
    status TEXT NOT NULL,
    previous_status TEXT,
    changed_by TEXT NOT NULL,           -- 'testator', 'keeper', 'beneficiary'
    tx_signature TEXT,                  -- Solana transaction signature (nullable for keeper)
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_will_status ON will_status_logs(will_pubkey);
CREATE INDEX idx_status_timestamp ON will_status_logs(created_at);
```

**Purpose**: Audit trail of all changes in will status

### Keeper Service Logs

```sql
CREATE TABLE keeper_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,               -- 'scan', 'trigger', 'error'
    will_pubkey TEXT,                   -- Null when scan global
    details TEXT,                       -- JSON string with details
    success BOOLEAN NOT NULL DEFAULT 1,
    error_message TEXT,
    execution_time_ms INTEGER,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_keeper_action ON keeper_logs(action);
CREATE INDEX idx_keeper_timestamp ON keeper_logs(created_at);
```

**Purpose**: Monitor performance and debugging keeper service

## Data Flow

### Write Operations

1. **Create Will**

   ```
   Frontend → Backend API → Solana Program
   ↓
   Will Account created → Log to will_status_logs
   ```

2. **Heartbeat**

   ```
   Frontend → Solana Program (direct)
   ↓
   Backend monitors → Log to heartbeat_logs
   ```

3. **Keeper Trigger**
   ```
   Keeper Service → Solana Program
   ↓
   Status changed → Log to will_status_logs & keeper_logs
   ```

### Read Operations

1. **Dashboard Data**

   ```
   Frontend → Backend API → SQLite queries
   ↓
   Aggregate heartbeat/status data
   ```

2. **Will Status**
   ```
   Frontend → Solana RPC (direct read)
   ```

## Storage Considerations

### On-Chain Storage Cost

```
Will Account: ~200 bytes
Rent exemption: ~0.00203 SOL (~$0.05)
Very affordable for users!
```

### Off-Chain Storage Growth

```
Estimated growth per 1000 active wills:
- heartbeat_logs: ~365KB/year (daily heartbeats)
- will_status_logs: ~50KB/year (avg 5 status changes)
- keeper_logs: ~100KB/year (monitoring logs)
Total: ~515KB/year per 1000 wills
```

### Database Optimization

```sql
-- Cleanup old logs (retention policy)
DELETE FROM heartbeat_logs WHERE created_at < strftime('%s', 'now', '-2 years');
DELETE FROM keeper_logs WHERE created_at < strftime('%s', 'now', '-1 year');
-- Keep will_status_logs permanently for audit trail
```

## Design Decisions

### Why Split On-Chain/Off-Chain?

1. **Cost Efficiency**: Frequently written data (logs) off-chain
2. **Performance**: Fast queries for analytics without RPC calls
3. **Privacy**: Sensitive monitoring data stays private
4. **Scalability**: SQLite handles high-frequency writes efficiently

### PDA Strategy

1. **Deterministic**: Easy to derive addresses
2. **Unique**: One will per testator-beneficiary pair
3. **Secure**: Program-controlled, no private key needed
4. **Upgradeable**: Reserved space for future fields

### Database Choices

1. **SQLite**: Embedded, zero-config, perfect for VPS deployment
2. **Indexes**: Optimized for common query patterns
3. **Retention**: Different policies for different log types
4. **JSON Details**: Flexible storage for varying keeper data

## Migration Strategy

### Program Upgrades

```rust
// Reserved fields allow adding new data without migration
pub reserved: [u8; 64],
```

### Database Migrations

```sql
-- Example: Adding new field
ALTER TABLE heartbeat_logs ADD COLUMN block_height INTEGER;

-- Version tracking
CREATE TABLE schema_version (
    version INTEGER PRIMARY KEY,
    applied_at INTEGER DEFAULT (strftime('%s', 'now'))
);
```
