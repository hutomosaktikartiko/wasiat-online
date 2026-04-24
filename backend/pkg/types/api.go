package types

type HealthResponse struct {
	Status      string `json:"status"`
	UptimeSince string `json:"uptime_since"`
	LastScanAt  string `json:"last_scan_at,omitempty"`
	NextScanAt  string `json:"next_scan_at,omitempty"`
}

type AllTimeStats struct {
	TotalScans          int `json:"total_scans"`
	TotalWillsTriggered int `json:"total_wills_triggered"`
	TotalErrors         int `json:"total_errors"`
}

type PeriodStats struct {
	Scans          int     `json:"scans"`
	WillsTriggered int     `json:"wills_triggered"`
	Errors         int     `json:"errors"`
	SuccessRate    float64 `json:"success_rate"`
}

type LastScanInfo struct {
	At              string `json:"at"`
	AccountsScanned int    `json:"accounts_scanned"`
	Triggered       int    `json:"triggered"`
	DurationMs      int64  `json:"duration_ms"`
	Success         bool   `json:"success"`
}

type StatsResponse struct {
	AllTime  AllTimeStats  `json:"all_time"`
	Last24h  PeriodStats   `json:"last_24h"`
	LastScan *LastScanInfo `json:"last_scan"`
}

type LogEntry struct {
	ID           int64   `json:"id"`
	Action       string  `json:"action"`
	WillPubkey   *string `json:"will_pubkey"`
	Details      string  `json:"details"`
	Success      bool    `json:"success"`
	ErrorMessage *string `json:"error_message"`
	DurationMs   int64   `json:"duration_ms"`
	CreatedAt    string  `json:"created_at"`
}

type PaginationMeta struct {
	Total int `json:"total"`
	Page  int `json:"page"`
	Limit int `json:"limit"`
}

type LogsResponse struct {
	Data       []LogEntry     `json:"data"`
	Pagination PaginationMeta `json:"pagination"`
}
