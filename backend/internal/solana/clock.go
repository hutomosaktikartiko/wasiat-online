package solana

import (
	"context"
	"encoding/binary"
	"fmt"

	"github.com/gagliardetto/solana-go"
	"github.com/gagliardetto/solana-go/rpc"
)

// GetSolanaTime returns the current Solana blockchain timestamp
func GetSolanaTime(ctx context.Context, client *rpc.Client) (int64, error) {
	clockAccount, err := client.GetAccountInfo(ctx, solana.SysVarClockPubkey)
	if err != nil {
		return 0, fmt.Errorf("failed to get clock account: %v", err)
	}

	if clockAccount.Value == nil || len(clockAccount.Value.Data.GetBinary()) < 40 {
		return 0, fmt.Errorf("invalid clock account data")
	}

	// Parse Solana clock (unix_timestamp is at offset 32)
	solanaTime := int64(binary.LittleEndian.Uint64(clockAccount.Value.Data.GetBinary()[32:40]))
	return solanaTime, nil
}