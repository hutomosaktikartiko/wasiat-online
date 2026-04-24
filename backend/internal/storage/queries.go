package storage

import (
	"database/sql"
	"fmt"
	"strings"
	"time"

	"wasiat-online-backend/pkg/types"
)

func GetAllTimeStats(db *sql.DB) (types.AllTimeStats, error) {
	var stats types.AllTimeStats

	row := db.QueryRow(`
		SELECT
			COUNT(CASE WHEN action = 'scan' AND details LIKE 'Scanned%' THEN 1 END),
			COUNT(CASE WHEN action = 'trigger' AND success = 1 THEN 1 END),
			COUNT(CASE WHEN success = 0 THEN 1 END)
		FROM keeper_logs
	`)

	err := row.Scan(&stats.TotalScans, &stats.TotalWillsTriggered, &stats.TotalErrors)
	return stats, err
}

func GetLast24hStats(db *sql.DB) (types.PeriodStats, error) {
	var stats types.PeriodStats
	var total int
	var successful int

	row := db.QueryRow(`
		SELECT
			COUNT(CASE WHEN action = 'scan' AND details LIKE 'Scanned%' THEN 1 END),
			COUNT(CASE WHEN action = 'trigger' AND success = 1 THEN 1 END),
			COUNT(CASE WHEN success = 0 THEN 1 END),
			COUNT(*),
			COALESCE(SUM(success), 0)
		FROM keeper_logs
		WHERE created_at > strftime('%s', 'now', '-24 hours')
	`)

	err := row.Scan(&stats.Scans, &stats.WillsTriggered, &stats.Errors, &total, &successful)
	if err != nil {
		return stats, err
	}

	if total > 0 {
		stats.SuccessRate = float64(successful) / float64(total) * 100
	} else {
		stats.SuccessRate = 100
	}

	return stats, nil
}

func GetLastScanInfo(db *sql.DB) (*types.LastScanInfo, error) {
	row := db.QueryRow(`
		SELECT details, success, execution_time_ms, created_at
		FROM keeper_logs
		WHERE action = 'scan' AND details LIKE 'Scanned%'
		ORDER BY created_at DESC
		LIMIT 1
	`)

	var details string
	var success bool
	var durationMs int64
	var createdAt int64

	err := row.Scan(&details, &success, &durationMs, &createdAt)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	info := &types.LastScanInfo{
		At:         time.Unix(createdAt, 0).UTC().Format(time.RFC3339),
		DurationMs: durationMs,
		Success:    success,
	}

	// Parse: "Scanned X accounts, triggered Y wills, Z errors"
	fmt.Sscanf(details, "Scanned %d accounts, triggered %d wills,", &info.AccountsScanned, &info.Triggered)

	return info, nil
}

func GetLogs(db *sql.DB, limit, offset int, action string) ([]types.LogEntry, int, error) {
	where := `WHERE details NOT LIKE 'Starting%'`
	countArgs := []interface{}{}
	dataArgs := []interface{}{}

	if action != "" {
		where += ` AND action = ?`
		countArgs = append(countArgs, action)
		dataArgs = append(dataArgs, action)
	}

	var total int
	err := db.QueryRow(`SELECT COUNT(*) FROM keeper_logs `+where, countArgs...).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	dataArgs = append(dataArgs, limit, offset)
	rows, err := db.Query(`
		SELECT id, action, will_pubkey, details, success, error_message, execution_time_ms, created_at
		FROM keeper_logs `+where+`
		ORDER BY created_at DESC LIMIT ? OFFSET ?`, dataArgs...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	logs := []types.LogEntry{}
	for rows.Next() {
		var entry types.LogEntry
		var willPubkey sql.NullString
		var errorMsg sql.NullString
		var createdAt int64

		err := rows.Scan(
			&entry.ID,
			&entry.Action,
			&willPubkey,
			&entry.Details,
			&entry.Success,
			&errorMsg,
			&entry.DurationMs,
			&createdAt,
		)
		if err != nil {
			return nil, 0, err
		}

		entry.CreatedAt = time.Unix(createdAt, 0).UTC().Format(time.RFC3339)

		if willPubkey.Valid && willPubkey.String != "" {
			entry.WillPubkey = &willPubkey.String
		}

		if errorMsg.Valid && errorMsg.String != "" {
			sanitized := sanitizeError(errorMsg.String)
			entry.ErrorMessage = &sanitized
		}

		logs = append(logs, entry)
	}

	return logs, total, nil
}

func sanitizeError(errMsg string) string {
	lower := strings.ToLower(errMsg)

	patterns := []struct {
		match string
		safe  string
	}{
		{"dial tcp", "RPC connection failed"},
		{"connection refused", "RPC connection failed"},
		{"context deadline exceeded", "Request timed out"},
		{"failed to get program", "Failed to fetch program accounts"},
		{"failed to send transaction", "Transaction submission failed"},
		{"failed to sign", "Transaction signing failed"},
		{"failed to get latest", "Failed to get blockhash"},
		{"failed to get clock", "Failed to get Solana time"},
	}

	for _, p := range patterns {
		if strings.Contains(lower, p.match) {
			return p.safe
		}
	}

	return "Internal error"
}
