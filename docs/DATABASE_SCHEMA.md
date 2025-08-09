# Database Schema

Dokumentasi lengkap struktur data untuk on-chain (Solana Program) dan off-chain (SQLite) components.

## On-Chain Schema (Solana Program)

### Will Account Structure

```rust
#[account]
pub struct Will {
    // Identifiers
    pub testator: Pubkey,           // 32 bytes - Pewasiat
    pub beneficiary: Pubkey,        // 32 bytes - Penerima manfaat
    pub vault: Pubkey,              // 32 bytes - PDA vault untuk aset

    // Configuration
    pub heartbeat_period: i64,      // 8 bytes - Periode heartbeat (seconds)
    pub service_fee_bps: u16,       // 2 bytes - Biaya layanan (basis points)

    // Status & Timing
    pub status: WillStatus,         // 1 byte - Status wasiat
    pub created_at: i64,            // 8 bytes - Timestamp pembuatan
    pub last_heartbeat: i64,        // 8 bytes - Timestamp heartbeat terakhir
    pub triggered_at: Option<i64>,  // 9 bytes - Timestamp trigger

    // Metadata
    pub bump: u8,                   // 1 byte - PDA bump
    pub vault_bump: u8,             // 1 byte - Vault PDA bump

    // Reserved untuk future upgrades
    pub reserved: [u8; 64],         // 64 bytes - Reserved space
}
// Total: ~200 bytes per will account
```

### Will Status Enum

```rust
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum WillStatus {
    Created,    // 0 - Baru dibuat, belum ada aset
    Active,     // 1 - Ada aset, heartbeat aktif
    Triggered,  // 2 - Timer habis, bisa diklaim
    Claimed,    // 3 - Sudah diklaim beneficiary
    Withdrawn,  // 4 - Aset ditarik kembali oleh testator
}
```

### Global Config Account

```rust
#[account]
pub struct GlobalConfig {
    pub authority: Pubkey,          // 32 bytes - Admin program
    pub fee_vault: Pubkey,          // 32 bytes - Vault untuk fee collection
    pub default_service_fee_bps: u16, // 2 bytes - Default fee
    pub min_heartbeat_period: i64,  // 8 bytes - Minimum heartbeat period
    pub max_heartbeat_period: i64,  // 8 bytes - Maximum heartbeat period
    pub paused: bool,               // 1 byte - Emergency pause
    pub bump: u8,                   // 1 byte - PDA bump
    pub reserved: [u8; 32],         // 32 bytes - Reserved
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
    will_pubkey TEXT NOT NULL,          -- Public key dari will account
    testator_pubkey TEXT NOT NULL,      -- Public key pewasiat
    heartbeat_timestamp INTEGER NOT NULL, -- Unix timestamp heartbeat
    tx_signature TEXT NOT NULL,         -- Solana transaction signature
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_heartbeat_will ON heartbeat_logs(will_pubkey);
CREATE INDEX idx_heartbeat_timestamp ON heartbeat_logs(heartbeat_timestamp);
```

**Purpose**: Track heartbeat history untuk analytics dan debugging

### Will Status Tracking

```sql
CREATE TABLE will_status_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    will_pubkey TEXT NOT NULL,          -- Public key dari will account
    status TEXT NOT NULL,               -- 'created', 'active', 'triggered', 'claimed', 'withdrawn'
    previous_status TEXT,               -- Status sebelumnya (nullable)
    changed_by TEXT NOT NULL,           -- 'testator', 'keeper', 'beneficiary'
    tx_signature TEXT,                  -- Solana transaction signature (nullable untuk keeper)
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_will_status ON will_status_logs(will_pubkey);
CREATE INDEX idx_status_timestamp ON will_status_logs(created_at);
```

**Purpose**: Audit trail semua perubahan status wasiat

### Keeper Service Logs

```sql
CREATE TABLE keeper_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,               -- 'scan', 'trigger', 'error'
    will_pubkey TEXT,                   -- Null jika scan global
    details TEXT,                       -- JSON string dengan detail
    success BOOLEAN NOT NULL DEFAULT 1,
    error_message TEXT,                 -- Error message jika gagal
    execution_time_ms INTEGER,          -- Waktu eksekusi dalam milliseconds
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_keeper_action ON keeper_logs(action);
CREATE INDEX idx_keeper_timestamp ON keeper_logs(created_at);
```

**Purpose**: Monitor performa dan debugging keeper service

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
