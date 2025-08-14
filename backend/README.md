# Wasiat Online - Keeper Service

Backend service that functions as a keeper to monitor and trigger will who have expired.

## Features

- Scan all Will Accounts every 6 hours
- Trigger Will that has expired automatically
- Logging all activities to SQLite Database
- Clean Architecture with Separation of Concenses
- Docker Support for Deployment

## Project Structure

```
backend/
├── cmd/keeper/main.go           # Entry point
├── internal/
│   ├── keeper/service.go        # Business logic
│   ├── solana/client.go         # Blockchain client
│   └── storage/database.go      # Database layer
├── pkg/types/will.go            # Shared types
├── Makefile                     # Build commands
└── Dockerfile                   # Container config
```

## Quick Start

### 1. Setup Environment

```bash
cp .env.example .env
# Edit .env with your KEEPER_PRIVATE_KEY and SOLANA_RPC_URL
```

### 2. Generate Keeper Keypair

```bash
solana-keygen new --outfile keeper-keypair.json
solana airdrop 2 $(solana-keygen pubkey keeper-keypair.json) --url devnet
```

### 3. Run Service

```bash
# Development
make run

# Production build
make build
./bin/keeper
```

## Docker Deployment

```bash
make docker-build
make docker-run
```

## Monitoring

Query Sqlite Database for Monitoring:

```sql
-- Recent activities
SELECT * FROM keeper_logs ORDER BY created_at DESC LIMIT 10;

-- Success rate (24h)
SELECT
  action,
  COUNT(*) as total,
  SUM(success) as successful,
  ROUND(SUM(success) * 100.0 / COUNT(*), 2) as success_rate
FROM keeper_logs
WHERE created_at > strftime('%s', 'now', '-24 hours')
GROUP BY action;
```

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Cron Scheduler │────│  Keeper Service  │────│  Solana Program  │
│  (Every 6h)     │    │  - Scan Wills    │    │  - trigger_will  │
└─────────────────┘    │  - Parse Data    │    └──────────────────┘
                       │  - Send Tx       │
                       └──────────────────┘
                                │
                       ┌──────────────────┐
                       │  SQLite DB       │
                       │  - keeper_logs   │
                       └──────────────────┘
```
