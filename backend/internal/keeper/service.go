package keeper

import (
	"context"
	"database/sql"
	"encoding/binary"
	"fmt"
	"log"
	"time"

	"wasiat-online-backend/internal/storage"
	"wasiat-online-backend/pkg/types"

	"github.com/gagliardetto/solana-go"
	"github.com/gagliardetto/solana-go/rpc"
)

type SolanaClient interface {
	GetProgramAccounts(ctx context.Context) ([]*rpc.KeyedAccount, error)
	TriggerWill(ctx context.Context, willPubkey solana.PublicKey) (string, error)
	GetSolanaTime(ctx context.Context) (int64, error)
}

type Service struct {
	db     *sql.DB
	client SolanaClient
}

func New(db *sql.DB, client SolanaClient) *Service {
	return &Service{
		db:     db,
		client: client,
	}
}

func (s *Service) ScanAndTriggerWills() error {
	startTime := time.Now()
	ctx := context.Background()

	storage.LogKeeperAction(s.db, "scan", "", "Starting will scan", true, "", 0)

	accounts, err := s.client.GetProgramAccounts(ctx)
	if err != nil {
		storage.LogKeeperAction(s.db, "scan", "", fmt.Sprintf("Failed to get program accounts: %v", err), false, err.Error(), time.Since(startTime).Milliseconds())
		return fmt.Errorf("failed to get program accounts: %v", err)
	}

	log.Printf("Found %d program accounts", len(accounts))

	triggeredCount := 0
	errorCount := 0

	for _, account := range accounts {
		will, err := s.parseWillAccount(account.Account.Data.GetBinary())
		if err != nil {
			log.Printf("Failed to parse will account %s: %v", account.Pubkey, err)
			errorCount++
			continue
		}

		fmt.Println("will status", will.Status)

		if will.Status != types.WillStatusActive {
			continue
		}

		// Get Solana clock for accurate time comparison
		solanaTime, err := s.client.GetSolanaTime(ctx)
		if err != nil {
			log.Printf("Failed to get Solana time: %v", err)
			errorCount++
			continue
		}
		expiryTime := will.LastHeartbeat + int64(will.HeartbeatPeriod)
		gracePeriod := int64(300) // 5 minutes (same as smart contract TRIGGER_GRACE_PERIOD)

		log.Printf("Will %s: solanaTime=%d, lastHeartbeat=%d, period=%d, expiry=%d, withGrace=%d",
			account.Pubkey, solanaTime, will.LastHeartbeat, will.HeartbeatPeriod, expiryTime, expiryTime+gracePeriod)

		// Check if expired
		if solanaTime >= expiryTime+gracePeriod {
			log.Printf("Will %s is expired, triggering...", account.Pubkey)

			sig, err := s.client.TriggerWill(ctx, account.Pubkey)
			if err != nil {
				log.Printf("Failed to trigger will %s: %v", account.Pubkey, err)
				storage.LogKeeperAction(s.db, "trigger", account.Pubkey.String(), fmt.Sprintf("Failed to trigger: %v", err), false, err.Error(), 0)
				errorCount++
				continue
			}

			log.Printf("Successfully triggered will %s, tx: %s", account.Pubkey, sig)
			storage.LogKeeperAction(s.db, "trigger", account.Pubkey.String(), fmt.Sprintf("Triggered successfully, tx: %s", sig), true, "", 0)
			triggeredCount++
		}
	}

	executionTime := time.Since(startTime).Milliseconds()
	details := fmt.Sprintf("Scanned %d accounts, triggered %d wills, %d errors", len(accounts), triggeredCount, errorCount)

	storage.LogKeeperAction(s.db, "scan", "", details, errorCount == 0, "", executionTime)
	log.Printf("Scan completed: %s (took %dms)", details, executionTime)

	return nil
}

func (s *Service) parseWillAccount(data []byte) (*types.Will, error) {
	if len(data) < 200 {
		return nil, fmt.Errorf("account data too short: %d bytes", len(data))
	}

	offset := 8 // Skip discriminator
	will := &types.Will{}

	copy(will.Testator[:], data[offset:offset+32])
	offset += 32

	copy(will.Beneficiary[:], data[offset:offset+32])
	offset += 32

	copy(will.Vault[:], data[offset:offset+32])
	offset += 32

	will.HeartbeatPeriod = binary.LittleEndian.Uint32(data[offset : offset+4])
	offset += 4

	will.Status = types.WillStatus(data[offset])
	offset += 1

	will.CreatedAt = int64(binary.LittleEndian.Uint64(data[offset : offset+8]))
	offset += 8

	will.LastHeartbeat = int64(binary.LittleEndian.Uint64(data[offset : offset+8]))
	offset += 8

	if data[offset] == 1 {
		offset += 1
		triggerAt := int64(binary.LittleEndian.Uint64(data[offset : offset+8]))
		will.TriggerAt = &triggerAt
		offset += 8
	} else {
		offset += 9
	}

	will.Bump = data[offset]
	offset += 1

	will.VaultBump = data[offset]

	return will, nil
}
