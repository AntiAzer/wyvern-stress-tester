package bot

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"wyvern.pw/api/cloudproxy"
	"wyvern.pw/controllers/setting"
)

var (
	maxWorker     = 300
	currentWorker = 0
)

func GetCurrentWorker() int {
	return currentWorker
}

func SolveChallenge(c *gin.Context) {
	if currentWorker >= maxWorker {
		c.JSON(http.StatusTooManyRequests, SolveResponse{
			Code:    http.StatusTooManyRequests,
			Message: "Wait some times...",
			Cookies: nil,
		})
		c.Abort()
		return
	}

	currentWorker++
	var request SolveRequest
	err := c.BindJSON(&request)
	if err != nil {
		currentWorker--
		c.JSON(http.StatusInternalServerError, SolveResponse{
			Code:    http.StatusInternalServerError,
			Message: err.Error(),
			Cookies: nil,
		})
		c.Abort()
		return
	}

	apiKey, err := setting.GetApiKey()
	if err != nil {
		currentWorker--
		c.JSON(http.StatusInternalServerError, SolveResponse{
			Code:    http.StatusInternalServerError,
			Message: err.Error(),
			Cookies: nil,
		})
		c.Abort()
		return
	}
	cookies, err := cloudproxy.GetCookie(request.URL, request.Proxy, request.UserAgent, request.SiteKey, apiKey)
	if err != nil {
		currentWorker--
		c.JSON(http.StatusInternalServerError, SolveResponse{
			Code:    http.StatusInternalServerError,
			Message: err.Error(),
			Cookies: nil,
		})
		c.Abort()
		return
	}
	currentWorker--
	c.JSON(http.StatusOK, SolveResponse{
		Code:    http.StatusOK,
		Message: "",
		Cookies: cookies,
	})
	c.Abort()
	return
}
