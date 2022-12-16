package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Index(c *gin.Context) {
	c.HTML(http.StatusOK, "index.html", nil)
}

func AttractionPage(c *gin.Context) {
	c.HTML(http.StatusOK, "attraction.html", nil)
}

func BookingPage(c *gin.Context) {
	c.HTML(http.StatusOK, "booking.html", nil)
}
