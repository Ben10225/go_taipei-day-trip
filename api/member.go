package api

import (
	"log"
	"net/http"
	"strconv"
	"strings"
	"taipei-day-trip/db"
	"taipei-day-trip/structs"
	"taipei-day-trip/utils"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/gin-gonic/gin"
)

func GetHistory(c *gin.Context) {
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

	orders := db.GetUserOrders(payload.Uuid)

	// 要測沒有 orders 的狀況
	if orders == nil {
		c.JSON(http.StatusOK, gin.H{
			"data": nil,
		})
		return
	}

	// var history []interface{}
	var history []structs.History

	for _, order := range orders {
		attractionInfo := db.GetUserOrdersAttraction(order.Payment_id, order.Order_number)
		if attractionInfo == nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   true,
				"message": "伺服器錯誤",
			})
			return
		}

		attrTimeLst := strings.Split(order.Time, "T")
		minSec := strings.Split(attrTimeLst[1], "+")[0][:5]
		attrTime := attrTimeLst[0] + " " + minSec

		attr := structs.History{
			OrderNumber:  order.Order_number + "-" + strconv.Itoa(order.Payment_id),
			TotalPrice:   order.Total_price,
			ContactName:  order.Contact_name,
			ContactEmail: order.Contact_email,
			ContactPhone: order.Contact_phone,
			Trips:        attractionInfo,
			Time:         attrTime,
		}
		history = append(history, attr)
	}

	c.JSON(http.StatusOK, gin.H{
		"data": history,
	})
}

func ChangeUserName(c *gin.Context) {
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

	req := struct {
		Name string
	}{}
	err = c.BindJSON(&req)
	if err != nil {
		log.Fatal(err)
	}

	name := req.Name
	uuid := payload.Uuid

	if name == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   true,
			"message": "未登入狀態",
		})
		return
	}
	updated := db.UpdateUserName(uuid, name)
	if !updated {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   true,
			"message": "伺服器錯誤",
		})
		return
	}
	newToken := utils.GenerateJWT(uuid, name)
	c.SetCookie("token", newToken, 0, "/", "", false, true)
	c.JSON(http.StatusOK, gin.H{
		"ok": true,
	})
}

func GetImg(c *gin.Context) {
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
	BUCKETNAME := utils.EnvGet("bucket_name")
	AWS_ACCESS_KEY_ID := utils.EnvGet("aws_access_key_id")
	AWS_SECRET_ACCESS_KEY := utils.EnvGet("aws_secret_access_key")

	sess, err := session.NewSession(&aws.Config{
		Region:      aws.String(utils.EnvGet("region_name")),
		Credentials: credentials.NewStaticCredentials(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, ""),
	})

	if err != nil {
		log.Println("Failed to sign request", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   true,
			"message": "伺服器錯誤",
		})
		return
	}

	// Create S3 service client
	svc := s3.New(sess)

	req, _ := svc.GetObjectRequest(&s3.GetObjectInput{
		Bucket: aws.String(BUCKETNAME),
		Key:    aws.String(payload.Uuid),
	})
	urlStr, err := req.Presign(15 * time.Minute)

	if err != nil {
		log.Println("Failed to sign request", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   true,
			"message": "伺服器錯誤",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": urlStr,
	})
}
