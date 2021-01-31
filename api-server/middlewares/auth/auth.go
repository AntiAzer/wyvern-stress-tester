package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
	cAuth "wyvern.pw/controllers/auth"
)

func CheckUserToken(c *gin.Context) {
	token := c.GetHeader("Token")
	authSuccess, err := cAuth.CheckToken(token)
	if err != nil {
		c.JSON(http.StatusOK, cAuth.Response{
			Code:    http.StatusInternalServerError,
			Message: err.Error(),
		})
		c.Abort()
		return
	}
	if authSuccess {
		c.Next()
	} else {
		c.JSON(http.StatusOK, cAuth.Response{
			Code:    http.StatusUnauthorized,
			Message: "Wrong Authorization.",
		})
		c.Abort()
		return
	}
}
