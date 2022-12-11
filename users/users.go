package users

import (
	"log"
	"net/http"
	"strconv"
	"strings"
	"taipei-day-trip/db"
	"taipei-day-trip/structs"
	"taipei-day-trip/utility"

	"github.com/gin-gonic/gin"
	"golang.org/x/exp/slices"
)

func Attractions(c *gin.Context) {
	page := c.Query("page")
	keyword := c.Query("keyword")

	if page == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   true,
			"message": "輸入錯誤",
		})
		return
	}

	p, err := strconv.Atoi(page)
	if err != nil || p < 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   true,
			"message": "輸入錯誤",
		})
		return
	}

	items, next := db.SelectAttractions(page, keyword)
	if len(items) > 0 {
		var datas []gin.H
		for _, v := range items {
			imgs := strings.Split(v.Urls, ",")
			datas = append(datas, gin.H{
				"id":          v.Id,
				"name":        v.Name,
				"category":    v.Category_name,
				"description": v.Description,
				"address":     v.Address,
				"transport":   v.Transport,
				"mrt":         v.Mrt_name,
				"lat":         v.Lat,
				"lng":         v.Lng,
				"images":      imgs,
			})
		}

		var nextPage interface{}
		if next {
			nextPage = p + 1
		} else {
			nextPage = nil
		}
		c.JSON(http.StatusOK, gin.H{
			"data":     datas,
			"nextPage": nextPage,
		})
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   true,
			"message": "無資料",
		})
	}
}

func Attraction(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   true,
			"message": "無法辨識數字",
		})
		return
	}

	attraction := db.SelectAttractionById(id)
	if attraction == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   true,
			"message": "無此資料",
		})
		return
	}

	imgs := strings.Split(attraction.Urls, ",")
	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"id":          attraction.Id,
			"name":        attraction.Name,
			"category":    attraction.Category_name,
			"description": attraction.Description,
			"address":     attraction.Address,
			"transport":   attraction.Transport,
			"mrt":         attraction.Mrt_name,
			"lat":         attraction.Lat,
			"lng":         attraction.Lng,
			"images":      imgs,
		},
	})
}

func Categories(c *gin.Context) {
	lst := db.SelectCategories()
	var result []string
	if len(lst) == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   true,
			"message": "尚無類別",
		})
	}
	for _, v := range lst {
		if !slices.Contains(result, v) {
			result = append(result, v)
		}
	}
	c.JSON(http.StatusOK, gin.H{
		"data": result,
	})
}

func Auth(c *gin.Context) {
	token, err := c.Cookie("token")
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"error": true,
		})
		return
	}
	_, err = utility.ParseToken(token)
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

	checked := utility.Validate(email, password)
	if name == "" || !checked {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   true,
			"message": "帳戶註冊失敗",
		})
		return
	}

	password, _ = utility.PwdHash(password)

	userCreated := db.CheckAndInsertUser(name, email, password)

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
	var req structs.UserData
	err := c.BindJSON(&req)
	if err != nil {
		log.Fatal(err)
	}

	email := req.Email
	password := req.Password

	checked := utility.Validate(email, password)
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
	pwdVerify := utility.PwdVerify(password, user.Password)

	if pwdVerify {
		token := utility.GenerateJWT(user.Uid, user.Name)
		c.SetCookie("token", token, 0, "/", "http://0.0.0.0:3002", false, true)
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
	c.SetCookie("token", "", -1, "/", "http://0.0.0.0:3002", false, true)
	c.JSON(http.StatusFound, gin.H{
		"ok": true,
	})
}
