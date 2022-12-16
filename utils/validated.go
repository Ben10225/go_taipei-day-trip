package utils

import (
	"github.com/dlclark/regexp2"
)

const emailPattern = `^\S+@\S+$`
const passwordPattern = `^(?=.*\d)(?=.*[a-z])[0-9a-z]{2,}$`

func Validate(email, password string) bool {
	reg, _ := regexp2.Compile(emailPattern, 0)
	eBool, _ := reg.MatchString(email)
	reg, _ = regexp2.Compile(passwordPattern, 0)
	pBool, _ := reg.MatchString(password)

	return eBool && pBool
}
