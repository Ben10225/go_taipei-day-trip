package main

import (
	"taipei-day-trip/db"
	"taipei-day-trip/handlers"
	"taipei-day-trip/users"

	"github.com/gin-gonic/gin"
)

// nodemon --exec go run main.go --signal SIGTERM

const portNumber = ":3002"

func main() {
	router := gin.Default()
	db.InitDb()

	router.LoadHTMLGlob("templates/*")
	router.Static("/public", "./public")

	router.GET("/", handlers.Index)
	router.GET("/attraction/:id", handlers.AttractionPage)
	router.GET("/api/attractions", users.Attractions)
	router.GET("/api/attraction/:id", users.Attraction)
	router.GET("/api/categories", users.Categories)

	router.GET("/api/user/auth", users.Auth)
	router.POST("/api/user", users.SignUp)
	router.PUT("/api/user/auth", users.SignIn)
	router.DELETE("/api/user/auth", users.SignOut)
	router.Run(portNumber)
}
