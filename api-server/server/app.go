package server

import (
	"github.com/gin-gonic/gin"
	"wyvern.pw/config"
	cStatus "wyvern.pw/controllers/status"
	"wyvern.pw/data"
)

func Start() {
	cStatus.InitStatusController()

	gin.SetMode(gin.ReleaseMode)
	router := getRouter()
	router.Run(":" + config.PORT)
}

func Clear() {
	data.CloseConnection()
}
