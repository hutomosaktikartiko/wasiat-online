package api

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"wasiat-online-backend/internal/storage"
	"wasiat-online-backend/pkg/types"
)

type Server struct {
	db        *sql.DB
	startTime time.Time
}

func NewServer(db *sql.DB) *Server {
	return &Server{
		db:        db,
		startTime: time.Now().UTC(),
	}
}

func (s *Server) Start() {
	port := os.Getenv("API_PORT")
	if port == "" {
		port = "8080"
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/health", s.handleHealth)
	mux.HandleFunc("/stats", s.handleStats)
	mux.HandleFunc("/logs", s.handleLogs)

	log.Printf("API server started on :%s", port)
	if err := http.ListenAndServe(":"+port, withCORS(mux)); err != nil {
		log.Printf("API server error: %v", err)
	}
}

func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func (s *Server) handleHealth(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		return
	}

	lastScan, err := storage.GetLastScanInfo(s.db)
	if err != nil {
		log.Printf("Failed to get last scan info: %v", err)
	}

	status := "healthy"
	if lastScan != nil && !lastScan.Success {
		status = "degraded"
	}

	resp := types.HealthResponse{
		Status:      status,
		UptimeSince: s.startTime.Format(time.RFC3339),
	}

	if lastScan != nil {
		resp.LastScanAt = lastScan.At

		lastScanTime, err := time.Parse(time.RFC3339, lastScan.At)
		if err == nil {
			resp.NextScanAt = lastScanTime.Add(6 * time.Hour).UTC().Format(time.RFC3339)
		}
	}

	writeJSON(w, http.StatusOK, resp)
}

func (s *Server) handleStats(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		return
	}

	allTime, err := storage.GetAllTimeStats(s.db)
	if err != nil {
		log.Printf("Failed to get all-time stats: %v", err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "failed to get stats"})
		return
	}

	last24h, err := storage.GetLast24hStats(s.db)
	if err != nil {
		log.Printf("Failed to get 24h stats: %v", err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "failed to get stats"})
		return
	}

	lastScan, err := storage.GetLastScanInfo(s.db)
	if err != nil {
		log.Printf("Failed to get last scan info: %v", err)
	}

	writeJSON(w, http.StatusOK, types.StatsResponse{
		AllTime:  allTime,
		Last24h:  last24h,
		LastScan: lastScan,
	})
}

func (s *Server) handleLogs(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		return
	}

	q := r.URL.Query()

	limit := 20
	if l := q.Get("limit"); l != "" {
		if v, err := strconv.Atoi(l); err == nil && v > 0 && v <= 100 {
			limit = v
		}
	}

	page := 1
	if p := q.Get("page"); p != "" {
		if v, err := strconv.Atoi(p); err == nil && v > 0 {
			page = v
		}
	}

	action := q.Get("action")
	if action != "scan" && action != "trigger" {
		action = ""
	}

	offset := (page - 1) * limit

	logs, total, err := storage.GetLogs(s.db, limit, offset, action)
	if err != nil {
		log.Printf("Failed to get logs: %v", err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "failed to get logs"})
		return
	}

	writeJSON(w, http.StatusOK, types.LogsResponse{
		Data: logs,
		Pagination: types.PaginationMeta{
			Total: total,
			Page:  page,
			Limit: limit,
		},
	})
}
