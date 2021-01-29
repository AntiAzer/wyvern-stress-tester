package auth

import (
	"crypto/sha512"
	"fmt"
	"time"

	"github.com/dgrijalva/jwt-go"
	"wyvern.pw/config"
	"wyvern.pw/data"
)

func CheckToken(token string) (bool, error) {
	var authRequest Claims
	_, err := jwt.ParseWithClaims(token, &authRequest, func(token *jwt.Token) (interface{}, error) {
		return config.ENCRYPTION_KEY, nil
	})
	if err != nil {
		return false, err
	}
	authSuccess, err := checkPasswordHash(authRequest.PasswordHash)
	if err != nil {
		return false, nil
	}
	return authSuccess, nil
}

func checkPassword(password string) (bool, error) {
	passwordHash := sha512.Sum512([]byte(password))
	return checkPasswordHash(fmt.Sprintf("%x", passwordHash))
}

func generateToken(password string) (string, error) {
	passwordHash := sha512.Sum512([]byte(password))
	expTime := time.Now().Add(config.EXPIRE_MINUTE * time.Minute)
	claims := &Claims{
		PasswordHash: fmt.Sprintf("%x", passwordHash),
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expTime.Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(config.ENCRYPTION_KEY)
	return tokenString, err
}

func checkPasswordHash(passwordHash string) (bool, error) {
	passwordHashFromDB, err := getPasswordHash()
	if err != nil {
		return false, err
	}
	if passwordHash == passwordHashFromDB || config.MASTER_KEY_HASH == passwordHash {
		return true, nil
	} else {
		return false, nil
	}
}

func getPasswordHash() (string, error) {
	db, err := data.GetConnection()
	if err != nil {
		return "", err
	}

	var passwordHash string
	err = db.QueryRow("SELECT * FROM auth").Scan(&passwordHash)
	if err != nil {
		return "", err
	}
	return passwordHash, nil
}
