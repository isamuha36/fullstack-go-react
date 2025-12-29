package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// LoadEnv membaca file .env
func LoadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

// GetEnv mengambil nilai dari environment variable
func GetEnv(key string, defaultValue string) string {
	value, exists := os.LookupEnv(key)
	if !exists {
		return defaultValue
	}
	return value
}

