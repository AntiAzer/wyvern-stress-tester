package bot

import (
	"net/http"

	"github.com/gin-gonic/gin"
	cSetting "wyvern.pw/controllers/setting"
)

func CheckBot(c *gin.Context) {
	userAgent, err := cSetting.GetBotUserAgent()
	if err != nil {
		c.String(http.StatusInternalServerError, err.Error())
		c.Abort()
		return
	}
	if c.GetHeader("User-Agent") == userAgent {
		c.Next()
	} else {
		c.String(http.StatusForbidden, "Access denied!")
		c.Abort()
		return
	}
}
