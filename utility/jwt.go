package utility

import (
	"fmt"
	"time"

	"github.com/dgrijalva/jwt-go"
)

const SECRETKEY = "secretttttt" //私鑰

// 自定義 Claims
type CustomClaims struct {
	UserId int
	Name   string
	jwt.StandardClaims
}

func GenerateJWT(uid int, name string) string {
	maxAge := 60 * 60 * 24
	customClaims := &CustomClaims{
		UserId: uid, // 用戶 id
		Name:   name,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Duration(maxAge*7) * time.Second).Unix(),
			// 過期時間，必須設置
			// Issuer: name,
			// 非必須，也可以填充用戶名

			// Subject: fmt.Sprint(uid), // int64
		},
	}
	//採用 HMAC SHA256 加密算法
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, customClaims)
	tokenString, err := token.SignedString([]byte(SECRETKEY))
	if err != nil {
		fmt.Println(err)
	}
	// fmt.Printf("token: %v\n", tokenString)
	return tokenString

	// 解析 token
	// ret, err := ParseToken(tokenString)
	// if err != nil {
	// 	fmt.Println(err)
	// }
	// fmt.Printf("userinfo: %v\n", ret)
	// fmt.Println(ret.Issuer, ret.Subject, ret.ExpiresAt)
}

// 解析 token
func ParseToken(tokenString string) (*CustomClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(SECRETKEY), nil
	})
	if claims, ok := token.Claims.(*CustomClaims); ok && token.Valid {
		return claims, nil
	} else {
		return nil, err
	}
}
