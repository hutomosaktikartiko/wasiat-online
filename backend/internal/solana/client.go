package solana

import (
	"context"
	"fmt"
	"os"

	"github.com/gagliardetto/solana-go"
	"github.com/gagliardetto/solana-go/rpc"
)

const PROGRAM_ID = "A4Gbd666j7Bha4d6w231iamWYBmSYuxA7KKe42VY4Prw"

type Client struct {
	rpcClient *rpc.Client
	programID solana.PublicKey
	keeper    solana.PrivateKey
}

func NewClient() (*Client, error) {
	rpcEndpoint := os.Getenv("SOLANA_RPC_URL")
	if rpcEndpoint == "" {
		rpcEndpoint = rpc.DevNet_RPC
	}

	keeperKeyStr := os.Getenv("KEEPER_PRIVATE_KEY")
	if keeperKeyStr == "" {
		return nil, fmt.Errorf("KEEPER_PRIVATE_KEY environment variable is required")
	}

	keeperKey, err := solana.PrivateKeyFromBase58(keeperKeyStr)
	if err != nil {
		return nil, fmt.Errorf("invalid keeper private key: %v", err)
	}

	programID, err := solana.PublicKeyFromBase58(PROGRAM_ID)
	if err != nil {
		return nil, fmt.Errorf("invalid program ID: %v", err)
	}

	return &Client{
		rpcClient: rpc.New(rpcEndpoint),
		programID: programID,
		keeper:    keeperKey,
	}, nil
}

func (c *Client) GetProgramAccounts(ctx context.Context) ([]*rpc.KeyedAccount, error) {
	return c.rpcClient.GetProgramAccountsWithOpts(
		ctx,
		c.programID,
		&rpc.GetProgramAccountsOpts{
			Filters: []rpc.RPCFilter{
				{
					DataSize: 200,
				},
			},
		},
	)
}

func (c *Client) TriggerWill(ctx context.Context, willPubkey solana.PublicKey) (string, error) {
	configPDA, _, err := solana.FindProgramAddress(
		[][]byte{[]byte("config")},
		c.programID,
	)
	if err != nil {
		return "", fmt.Errorf("failed to derive config PDA: %v", err)
	}

	instruction := solana.NewInstruction(
		c.programID,
		solana.AccountMetaSlice{
			solana.NewAccountMeta(c.keeper.PublicKey(), true, true),
			solana.NewAccountMeta(willPubkey, false, true),
			solana.NewAccountMeta(configPDA, false, false),
		},
		[]byte{5}, // trigger_will instruction discriminator
	)

	recent, err := c.rpcClient.GetRecentBlockhash(ctx, rpc.CommitmentFinalized)
	if err != nil {
		return "", fmt.Errorf("failed to get recent blockhash: %v", err)
	}

	tx, err := solana.NewTransaction(
		[]solana.Instruction{instruction},
		recent.Value.Blockhash,
		solana.TransactionPayer(c.keeper.PublicKey()),
	)
	if err != nil {
		return "", fmt.Errorf("failed to create transaction: %v", err)
	}

	_, err = tx.Sign(func(key solana.PublicKey) *solana.PrivateKey {
		if key.Equals(c.keeper.PublicKey()) {
			return &c.keeper
		}
		return nil
	})
	if err != nil {
		return "", fmt.Errorf("failed to sign transaction: %v", err)
	}

	sig, err := c.rpcClient.SendTransactionWithOpts(
		ctx,
		tx,
		rpc.TransactionOpts{
			SkipPreflight:       false,
			PreflightCommitment: rpc.CommitmentProcessed,
		},
	)
	if err != nil {
		return "", fmt.Errorf("failed to send transaction: %v", err)
	}

	return sig.String(), nil
}