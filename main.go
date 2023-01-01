package main

import (
	"taipei-day-trip/api"
	"taipei-day-trip/db"
	"taipei-day-trip/handlers"

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
	router.GET("/booking", handlers.BookingPage)
	router.GET("/thankyou", handlers.ThankyouPage)
	router.GET("/member", handlers.MemberPage)

	router.GET("/api/attractions", api.Attractions)
	router.GET("/api/attraction/:id", api.Attraction)
	router.GET("/api/categories", api.Categories)

	router.GET("/api/user/auth", api.Auth)
	router.POST("/api/user", api.SignUp)
	router.PUT("/api/user/auth", api.SignIn)
	router.DELETE("/api/user/auth", api.SignOut)
	router.GET("/api/user/auth/cookie", api.GetReserveData)

	router.GET("/api/booking", api.GetBooking)
	router.GET("/api/booking/getinfo", api.GetUserInfo)
	router.POST("/api/booking", api.CreateBooking)
	router.DELETE("/api/booking", api.DeleteBooking)

	router.POST("/api/orders", api.CreateOrder)

	router.GET("/api/member", api.GetHistory)
	router.GET("/api/member/getimg", api.GetImg)
	router.POST("/api/member/name", api.ChangeUserName)
	router.Run(portNumber)
}
