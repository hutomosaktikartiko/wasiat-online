package types

import "github.com/gagliardetto/solana-go"

type WillStatus uint8

const (
	WillStatusCreated   WillStatus = 0
	WillStatusActive    WillStatus = 1
	WillStatusTriggered WillStatus = 2
	WillStatusClaimed   WillStatus = 3
	WillStatusWithdrawn WillStatus = 4
)

type Will struct {
	Testator        solana.PublicKey
	Beneficiary     solana.PublicKey
	Vault           solana.PublicKey
	HeartbeatPeriod uint32
	Status          WillStatus
	CreatedAt       int64
	LastHeartbeat   int64
	TriggerAt       *int64
	Bump            uint8
	VaultBump       uint8
}