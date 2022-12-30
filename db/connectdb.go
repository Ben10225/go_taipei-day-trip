package db

import (
	"log"

	"taipei-day-trip/utils"

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

	dsn := utils.EnvGet("DB_USERNAME") + ":" + utils.EnvGet("DB_PASSWORD") + "@tcp" + "(" + utils.EnvGet("DB_HOST") + ":" + utils.EnvGet("DB_PORT") + ")/" + utils.EnvGet("DB_NAME") + "?" + "parseTime=true&loc=Local"
	// fmt.Println("dsn : ", dsn)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Println(err)
	}
	return db
}
