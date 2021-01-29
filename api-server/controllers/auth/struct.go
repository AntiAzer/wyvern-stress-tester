package auth

import "github.com/dgrijalva/jwt-go"

type Response struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

type Claims struct {
	PasswordHash string
	jwt.StandardClaims
}

type Request struct {
	Token    string `json:"token"`
	Password string `json:"password"`
}
