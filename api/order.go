package api

import (
	"fmt"
	"log"
	"net/http"
	"taipei-day-trip/utils"

	"github.com/gin-gonic/gin"
)

func CreateOrder(c *gin.Context) {
	token, err := c.Cookie("token")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   true,
			"message": "未登入狀態",
		})
		return
	}
	payload, err := utils.ParseToken(token)
	if err != nil {
		c.SetCookie("token", "", -1, "/", "", false, true)
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   true,
			"message": "未登入狀態",
		})
		return
	}
	uuid := payload.Uuid
	fmt.Println(uuid)

	req := struct {
		Prime string
		Order struct {
			TotalPrice string
			Trips      []struct {
				Attraction struct {
					Id      string
					Name    string
					Address string
					Image   string
					Price   string
				}
				Date  string
				Price string
			}
			Contact struct {
				Name  string
				Email string
				Phone string
			}
		}
	}{}

	err = c.BindJSON(&req)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(req)
	c.JSON(http.StatusOK, gin.H{
		"ok": true,
	})
}
