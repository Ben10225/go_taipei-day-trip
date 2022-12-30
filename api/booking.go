package api

import (
	"log"
	"net/http"
	"taipei-day-trip/db"
	"taipei-day-trip/utils"

	"github.com/gin-gonic/gin"
)

func CreateBooking(c *gin.Context) {
	token, err := c.Cookie("token")
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"error":   true,
			"message": "未登入狀態",
		})
		return
	}
	payload, err := utils.ParseToken(token)
	if err != nil {
		c.SetCookie("token", "", -1, "/", "", false, true)
		c.JSON(http.StatusOK, gin.H{
			"error":   true,
			"message": "未登入狀態",
		})
		return
	}
	req := struct {
		AttractionId string
		Date         string
		Time         string
		Price        int
		Status       string
	}{}
	err = c.BindJSON(&req)
	if err != nil {
		log.Fatal(err)
	}

	insertMsg := db.CheckAndInsertBooking(payload.Uuid, req.AttractionId, req.Date, req.Time, req.Price, req.Status)

	if insertMsg == "行程建立成功" {
		c.JSON(http.StatusOK, gin.H{
			"ok": true,
		})
	} else if insertMsg == "此行程已存在" {
		c.JSON(http.StatusOK, gin.H{
			"error":   true,
			"message": "此行程已存在",
		})
	}
}

func GetBooking(c *gin.Context) {
	token, err := c.Cookie("token")
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"error":   true,
			"message": "未登入狀態",
		})
		return
	}
	payload, err := utils.ParseToken(token)
	if err != nil {
		c.SetCookie("token", "", -1, "/", "", false, true)
		c.JSON(http.StatusOK, gin.H{
			"error":   true,
			"message": "未登入狀態",
		})
		return
	}

	var result []interface{}

	bookings := db.GetBookings(payload.Uuid)
	if len(bookings) > 0 {
		for _, value := range bookings {
			book := gin.H{
				"attraction": gin.H{
					"id":      value.Attraction_id,
					"name":    value.Name,
					"address": value.Address,
					"image":   value.Url,
				},
				"date":  value.Date,
				"time":  value.Time,
				"price": value.Price,
				"bid":   value.Bid,
			}
			result = append(result, book)
		}
		c.JSON(http.StatusOK, gin.H{
			"data": result,
			"name": payload.Name,
		})
	} else {
		c.JSON(http.StatusOK, gin.H{
			"data":  true,
			"empty": true,
			"name":  payload.Name,
		})
	}
}

func DeleteBooking(c *gin.Context) {
	token, err := c.Cookie("token")
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"error":   true,
			"message": "未登入狀態",
		})
		return
	}
	_, err = utils.ParseToken(token)
	if err != nil {
		c.SetCookie("token", "", -1, "/", "", false, true)
		c.JSON(http.StatusOK, gin.H{
			"error":   true,
			"message": "未登入狀態",
		})
		return
	}
	req := struct {
		Bid int
	}{}
	err = c.BindJSON(&req)
	if err != nil {
		log.Fatal(err)
	}
	status := db.DeleteBooking(req.Bid)
	if status {
		c.JSON(http.StatusOK, gin.H{
			"ok": true,
		})
	}
}

func GetUserInfo(c *gin.Context) {
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
	userSlice := db.Get_user_info_by_uuid(uuid)
	if userSlice == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   true,
			"message": "伺服器錯誤",
		})
	}
	name := userSlice[0]
	email := userSlice[1]

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"name":  name,
			"email": email,
		},
	})
}
