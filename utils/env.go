package utils

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func EnvGet(s string) string {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	return os.Getenv(s)
}
