package api

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"taipei-day-trip/db"
	"taipei-day-trip/structs"
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

	var req structs.Orders
	// req := struct {
	// 	Prime string
	// 	Order struct {
	// 		TotalPrice string
	// 		Trips      []struct {
	// 			Attraction struct {
	// 				Id      string
	// 				Name    string
	// 				Address string
	// 				Image   string
	// 				Price   string
	// 			}
	// 			Date  string
	// 			Price string
	// 			Time string
	// 		}
	// 		Contact struct {
	// 			Name  string
	// 			Email string
	// 			Phone string
	// 		}
	// 	}
	// }{}

	err = c.BindJSON(&req)
	if err != nil {
		log.Fatal(err)
	}

	prime := req.Prime
	order := &req.Order

	if prime == "" || order == nil || len(order.Trips) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   true,
			"message": "資料輸入錯誤",
		})
	}

	url := "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
	partner_key := utils.EnvGet("PARTNER_KEY")

	// headers := gin.H{
	// 	"Content-Type": "application/json",
	// 	"x-api-key":    partner_key,
	// }

	data := gin.H{
		"prime":       prime,
		"partner_key": partner_key,
		"merchant_id": "bbnn669999_ESUN",
		"details":     "TapPay Taipei-day-trip orders",
		"amount":      req.Order.TotalPrice,
		"cardholder": gin.H{
			"phone_number": req.Order.Contact.Phone,
			// "name":         b64.StdEncoding.EncodeToString([]byte(req.Order.Contact.Name)),
			"name":  req.Order.Contact.Name,
			"email": req.Order.Contact.Email,
		},
		"remember": true,
	}

	bodyBytes, err := json.Marshal(data)
	if err != nil {
		log.Fatal(err)
	}

	reqNew, err := http.NewRequest("POST", url, bytes.NewBuffer(bodyBytes))
	if err != nil {
		log.Fatal(err)
	}

	reqNew.Header.Add("Content-Type", "application/json")
	reqNew.Header.Add("x-api-key", partner_key)

	client := &http.Client{}
	rsp, err := client.Do(reqNew)
	if err != nil {
		log.Fatal(err)
	}

	defer rsp.Body.Close()

	body, err := ioutil.ReadAll(rsp.Body)
	if err != nil {
		log.Fatal(err)
	}

	s := string(body)

	res := structs.TapPayRes{}
	json.Unmarshal([]byte(s), &res)

	orderNumber := utils.GenerateOrderNumber()
	totalPrice, _ := strconv.Atoi(order.TotalPrice)

	var paymentId int
	var success string

	if res.Status != 0 {
		p := structs.Payment{
			Order_number:  orderNumber,
			Uuid:          uuid,
			Total_price:   totalPrice,
			Contact_name:  order.Contact.Name,
			Contact_email: order.Contact.Email,
			Contact_phone: order.Contact.Phone,
			Status:        false,
		}
		paymentId = db.CreatePayment(
			p.Order_number,
			p.Uuid,
			p.Total_price,
			p.Contact_name,
			p.Contact_email,
			p.Contact_phone,
			p.Status,
		)
		success = "付款失敗"

	} else {
		p := structs.Payment{
			Order_number:  orderNumber,
			Uuid:          uuid,
			Total_price:   totalPrice,
			Contact_name:  order.Contact.Name,
			Contact_email: order.Contact.Email,
			Contact_phone: order.Contact.Phone,
			Status:        true,
		}
		paymentId = db.CreatePayment(
			p.Order_number,
			p.Uuid,
			p.Total_price,
			p.Contact_name,
			p.Contact_email,
			p.Contact_phone,
			p.Status,
		)
		success = "付款成功"
	}

	db.CreateTrips(paymentId, orderNumber, order.Trips)
	result := strconv.Itoa(paymentId)

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"number": orderNumber + "-" + result,
			"payment": gin.H{
				"status":  res.Status,
				"message": success,
			},
		},
	})
}
