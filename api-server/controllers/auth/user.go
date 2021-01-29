package auth

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func Check(c *gin.Context) {
	var request Request
	err := c.BindJSON(&request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, Response{
			Code:    http.StatusInternalServerError,
			Message: err.Error(),
		})
		c.Abort()
		return
	}
	authSuccess, err := CheckToken(request.Token)
	if err != nil {
		c.JSON(http.StatusInternalServerError, Response{
			Code:    http.StatusInternalServerError,
			Message: err.Error(),
		})
		c.Abort()
		return
	}
	if authSuccess {
		c.JSON(http.StatusOK, Response{
			Code:    http.StatusOK,
			Message: "Valid token.",
		})
		c.Abort()
		return
	} else {
		c.JSON(http.StatusUnauthorized, Response{
			Code:    http.StatusUnauthorized,
			Message: "Invalid token.",
		})
		c.Abort()
		return
	}
}

func Login(c *gin.Context) {
	var request Request
	err := c.BindJSON(&request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, Response{
			Code:    http.StatusInternalServerError,
			Message: err.Error(),
		})
		c.Abort()
		return
	}
	authSuccess, err := checkPassword(request.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, Response{
			Code:    http.StatusInternalServerError,
			Message: err.Error(),
		})
		c.Abort()
		return
	}
	if authSuccess {
		tokenString, err := generateToken(request.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, Response{
				Code:    http.StatusInternalServerError,
				Message: err.Error(),
			})
			c.Abort()
			return
		}
		c.JSON(http.StatusOK, Response{
			Code:    http.StatusOK,
			Message: tokenString,
		})
		c.Abort()
		return
	} else {
		c.JSON(http.StatusUnauthorized, Response{
			Code:    http.StatusUnauthorized,
			Message: "Invalid password!",
		})
		c.Abort()
		return
	}
}
