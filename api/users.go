package api

import (
	"log"
	"net/http"
	"strings"
	"taipei-day-trip/db"
	"taipei-day-trip/structs"
	"taipei-day-trip/utils"

	"github.com/gin-gonic/gin"
)

func Auth(c *gin.Context) {
	token, err := c.Cookie("token")
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"error": true,
		})
		return
	}
	_, err = utils.ParseToken(token)
	if err != nil {
		c.SetCookie("token", "", -1, "/", "http://0.0.0.0:3002", false, true)
		c.JSON(http.StatusOK, gin.H{
			"error": true,
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"ok": true,
	})
}

func SignUp(c *gin.Context) {
	var req structs.UserData
	err := c.BindJSON(&req)
	if err != nil {
		log.Fatal(err)
	}
	name := req.Name
	email := req.Email
	password := req.Password

	checked := utils.Validate(email, password)
	if name == "" || !checked {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   true,
			"message": "帳戶註冊失敗",
		})
		return
	}

	password, _ = utils.PwdHash(password)

	uuid := utils.GenerateUuid()

	userCreated := db.CheckAndInsertUser(uuid, name, email, password)

	if userCreated {
		c.JSON(http.StatusOK, gin.H{
			"data": "OK",
		})
		return
	}
	c.JSON(http.StatusBadRequest, gin.H{
		"error":   true,
		"message": "此信箱已存在",
	})
}

func SignIn(c *gin.Context) {
	var req struct {
		Email    string
		Password string
		Reserve  bool
		Date     string
		Radio    string
	}
	err := c.BindJSON(&req)
	if err != nil {
		log.Fatal(err)
	}

	email := req.Email
	password := req.Password

	checked := utils.Validate(email, password)
	if !checked {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   true,
			"message": "登入驗證失敗",
		})
		return
	}

	user, getUserbool := db.GetUserByEmail(email)
	if !getUserbool {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   true,
			"message": "查無此信箱",
		})
		return
	}
	pwdVerify := utils.PwdVerify(password, user.Password)

	if pwdVerify {
		if req.Reserve {
			reserveData := req.Date + " " + req.Radio
			c.SetCookie("reserve", reserveData, 0, "/", "", false, true)
		}
		token := utils.GenerateJWT(user.Uuid, user.Name)
		c.SetCookie("token", token, 0, "/", "", false, true)
		c.JSON(http.StatusOK, gin.H{
			"data": "OK",
		})
		return
	}

	c.JSON(http.StatusBadRequest, gin.H{
		"error":   true,
		"message": "密碼錯誤",
	})
}

func SignOut(c *gin.Context) {
	c.SetCookie("token", "", -1, "/", "", false, true)
	c.JSON(http.StatusFound, gin.H{
		"ok": true,
	})
}

func GetReserveData(c *gin.Context) {
	reserve, err := c.Cookie("reserve")
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"error": true,
		})
		return
	}
	date := strings.Split(reserve, " ")[0]
	radio := strings.Split(reserve, " ")[1]

	c.SetCookie("reserve", "", -1, "/", "", false, true)
	c.JSON(http.StatusOK, gin.H{
		"ok":    true,
		"date":  date,
		"radio": radio,
	})
}
