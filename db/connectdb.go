package db

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var Db *gorm.DB

func InitDb() *gorm.DB {
	Db = connectDB()
	return Db
}

func connectDB() *gorm.DB {
	var err error
	dsn := envGet("DB_USERNAME") + ":" + envGet("DB_PASSWORD") + "@tcp" + "(" + envGet("DB_HOST") + ":" + envGet("DB_PORT") + ")/" + envGet("DB_NAME") + "?" + "parseTime=true&loc=Local"
	// fmt.Println("dsn : ", dsn)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Println(err)
	}
	return db
}

func envGet(s string) string {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	return os.Getenv(s)
}
