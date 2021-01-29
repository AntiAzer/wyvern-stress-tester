package setting

import (
	"crypto/sha512"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"wyvern.pw/data"
)

func UpdateSetting(c *gin.Context) {
	var request UpdateRequest
	err := c.BindJSON(&request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, Response{
			Code:    http.StatusInternalServerError,
			Message: err.Error(),
		})
		c.Abort()
		return
	}

	db, err := data.GetConnection()
	if err != nil {
		c.JSON(http.StatusInternalServerError, Response{
			Code:    http.StatusInternalServerError,
			Message: err.Error(),
		})
		c.Abort()
		return
	}
	if request.Name == "password" {
		passwordHash := sha512.Sum512([]byte(request.Value))
		_, err = db.Exec("UPDATE auth SET hash=$1",
			fmt.Sprintf("%x", passwordHash))
	} else {
		_, err = db.Exec("UPDATE setting SET value=$1 WHERE name=$2",
			request.Value, request.Name)
	}
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
		Message: "The setting was changed successfully.",
	})
	c.Abort()
	return
}
