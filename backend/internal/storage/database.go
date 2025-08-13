package storage

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

func InitDB() (*sql.DB, error) {
	db, err := sql.Open("sqlite3", "./keeper.db")
	if err != nil {
		return nil, err
	}

	if err := createTables(db); err != nil {
		return nil, err
	}

	return db, nil
}

func createTables(db *sql.DB) error {
	queries := []string{
		`CREATE TABLE IF NOT EXISTS keeper_logs (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			action TEXT NOT NULL,
			will_pubkey TEXT,
			details TEXT,
			success BOOLEAN NOT NULL DEFAULT 1,
			error_message TEXT,
			execution_time_ms INTEGER,
			created_at INTEGER DEFAULT (strftime('%s', 'now'))
		)`,
		`CREATE INDEX IF NOT EXISTS idx_keeper_action ON keeper_logs(action)`,
		`CREATE INDEX IF NOT EXISTS idx_keeper_timestamp ON keeper_logs(created_at)`,
	}

	for _, query := range queries {
		if _, err := db.Exec(query); err != nil {
			return err
		}
	}

	return nil
}

func LogKeeperAction(db *sql.DB, action, willPubkey, details string, success bool, errorMsg string, executionTime int64) error {
	query := `INSERT INTO keeper_logs (action, will_pubkey, details, success, error_message, execution_time_ms) 
			  VALUES (?, ?, ?, ?, ?, ?)`
	
	_, err := db.Exec(query, action, willPubkey, details, success, errorMsg, executionTime)
	return err
}