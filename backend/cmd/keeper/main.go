package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"wasiat-online-backend/internal/keeper"
	"wasiat-online-backend/internal/solana"
	"wasiat-online-backend/internal/storage"

	"github.com/joho/godotenv"
	"github.com/robfig/cron/v3"
)

func main() {
	log.Println("Starting Wasiat Online Keeper Service...")

	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Initialize database
	db, err := storage.InitDB()
	if err != nil {
		log.Fatal("Failed to initialize database:", err)
	}
	defer db.Close()

	// Initialize Solana client
	client, err := solana.NewClient()
	if err != nil {
		log.Fatal("Failed to initialize Solana client:", err)
	}

	// Initialize keeper service
	keeperService := keeper.New(db, client)

	// Initialize cron job
	c := cron.New()
	c.AddFunc("0 */6 * * *", func() {
		log.Println("Running keeper scan...")
		if err := keeperService.ScanAndTriggerWills(); err != nil {
			log.Printf("Keeper scan failed: %v", err)
		}
	})

	c.Start()
	log.Println("Keeper service started. Running every 6 hours...")

	go func() {
		time.Sleep(5 * time.Second)
		log.Println("Running initial keeper scan...")
		if err := keeperService.ScanAndTriggerWills(); err != nil {
			log.Printf("Initial keeper scan failed: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down keeper service...")
	c.Stop()
	log.Println("Keeper service stopped")
}
