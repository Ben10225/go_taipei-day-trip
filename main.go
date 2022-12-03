package main

import (
	"taipei-day-trip/handlers"
	"taipei-day-trip/users"

	"github.com/gin-gonic/gin"
)

// nodemon --exec go run main.go --signal SIGTERM

const portNumber = ":3002"

func main() {
	router := gin.Default()

	router.LoadHTMLGlob("templates/*")
	router.Static("/public", "./public")

	router.GET("/", handlers.Index)
	router.GET("/attraction/:id", handlers.AttractionPage)
	router.GET("/api/attractions", users.Attractions)
	router.GET("/api/attraction/:id", users.Attraction)
	router.GET("/api/categories", users.Categories)
	router.Run(portNumber)
}
