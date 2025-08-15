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

---

# Production Deployment Guide

## VPS Setup (Ubuntu 20.04+)

### 1. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y git build-essential sqlite3 curl wget

# Install Go 1.21
cd /tmp
wget https://go.dev/dl/go1.21.6.linux-amd64.tar.gz
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf go1.21.6.linux-amd64.tar.gz

# Add Go to PATH
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
source ~/.bashrc

# Verify Go installation
go version
```

### 2. Deploy Application

```bash
# Clone repository
cd ~
git clone your-repository-url
cd wasiat-online/backend

# Setup environment
cp .env.example .env
nano .env  # Edit with your configuration

# Build application
make build

# Test run (Ctrl+C to stop)
./bin/keeper
```

### 3. Setup System Service

```bash
# Create service file
sudo nano /etc/systemd/system/wasiat-keeper.service
```

Service configuration:

```ini
[Unit]
Description=Wasiat Online Keeper Service
After=network.target

[Service]
Type=simple
User=admin
WorkingDirectory=/home/admin/wasiat-online/backend
ExecStart=/home/admin/wasiat-online/backend/bin/keeper
Restart=always
RestartSec=5
Environment=PATH=/usr/local/go/bin:/usr/local/bin:/usr/bin:/bin

[Install]
WantedBy=multi-user.target
```

```bash
# Enable & start service
sudo systemctl daemon-reload
sudo systemctl enable wasiat-keeper
sudo systemctl start wasiat-keeper

# Check status
sudo systemctl status wasiat-keeper
```

## Management Commands

### Service Management

```bash
# Start service
sudo systemctl start wasiat-keeper

# Stop service
sudo systemctl stop wasiat-keeper

# Restart service
sudo systemctl restart wasiat-keeper

# Check status
sudo systemctl status wasiat-keeper

# Check if auto-start enabled
sudo systemctl is-enabled wasiat-keeper
```

### Logging & Monitoring

```bash
# View real-time logs
sudo journalctl -u wasiat-keeper -f

# View recent logs
sudo journalctl -u wasiat-keeper --since "1 hour ago"

# Check resource usage
htop
```

### Code Updates & Redeploy

```bash
# Navigate to project directory
cd ~/wasiat-online/backend

# Pull latest changes
git pull

# Rebuild application
make build

# Restart service with new binary
sudo systemctl restart wasiat-keeper

# Verify deployment
sudo systemctl status wasiat-keeper
```

### Database Management

```bash
# Check database file
ls -la keeper.db

# Backup database
cp keeper.db keeper_backup_$(date +%Y%m%d_%H%M%S).db

# View database tables
sqlite3 keeper.db ".tables"

# View recent keeper logs
sqlite3 keeper.db "SELECT * FROM keeper_logs ORDER BY created_at DESC LIMIT 10;"

# View keeper actions summary
sqlite3 keeper.db "SELECT action, COUNT(*) as count FROM keeper_logs GROUP BY action;"
```

## Troubleshooting

### Common Issues

**Service fails to start:**

```bash
# Check detailed logs
sudo journalctl -u wasiat-keeper -n 50

# Check file permissions
ls -la bin/keeper

# Verify working directory exists
ls -la /home/admin/wasiat-online/backend/
```

**RPC connection issues:**

```bash
# Test RPC endpoint
curl -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}' \
  https://api.devnet.solana.com
```

### Performance Monitoring

```bash
# Check memory usage
free -h

# Check disk space
df -h

# Monitor system resources
htop
```

## Environment Configuration

```bash
# For development (local validator)
SOLANA_RPC_URL=http://localhost:8899

# For devnet
SOLANA_RPC_URL=https://api.devnet.solana.com

# For mainnet
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Keeper private key (base58 format)
KEEPER_PRIVATE_KEY=your_keeper_private_key_base58

# Database path
DATABASE_PATH=./keeper.db
```

## Security Notes

- Keep private keys secure and never commit to version control
- Use environment variables for sensitive configuration
- Regularly backup the database
- Monitor logs for unusual activity
- Keep system and dependencies updated

**Resource Usage:**

- Memory: ~1-5MB
- Storage: ~20MB (binary + database)
- CPU: Minimal (runs every 6 hours)
