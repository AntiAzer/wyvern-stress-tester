package status

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/mackerelio/go-osstat/cpu"
	"github.com/mackerelio/go-osstat/memory"
	"github.com/ricochet2200/go-disk-usage/du"
)

func GetServerStatus(c *gin.Context) {
	statusType := c.Query("type")
	switch statusType {
	case "cpu":
		before, err := cpu.Get()
		if err != nil {
			c.JSON(http.StatusOK, Response{
				Code:  http.StatusInternalServerError,
				Value: err.Error(),
			})
			c.Abort()
			return
		}
		time.Sleep(time.Duration(1) * time.Second)
		after, err := cpu.Get()
		if err != nil {
			c.JSON(http.StatusOK, Response{
				Code:  http.StatusInternalServerError,
				Value: err.Error(),
			})
			c.Abort()
			return
		}
		total := float64(after.Total - before.Total)
		c.JSON(http.StatusOK, Response{
			Code:  http.StatusOK,
			Value: strconv.Itoa(int(float64(after.User-before.User) / total * 100)),
		})
		c.Abort()
		return
	case "ram":
		memory, err := memory.Get()
		if err != nil {
			c.JSON(http.StatusOK, Response{
				Code:  http.StatusInternalServerError,
				Value: err.Error(),
			})
			c.Abort()
			return
		}
		c.JSON(http.StatusOK, Response{
			Code:  http.StatusOK,
			Value: strconv.Itoa(int(float64(memory.Used) / float64(memory.Total) * 100)),
		})
		c.Abort()
		return
	case "disk":
		usage := du.NewDiskUsage("/")
		c.JSON(http.StatusOK, Response{
			Code:  http.StatusOK,
			Value: strconv.Itoa(int(usage.Usage() * 100)),
		})
		c.Abort()
		return
	case "worker":
		c.JSON(http.StatusOK, Response{
			Code:  http.StatusOK,
			Value: strconv.Itoa(0),
		})
		c.Abort()
		return
	default:
		c.JSON(http.StatusOK, Response{
			Code:  http.StatusBadRequest,
			Value: "Wrong status type.",
		})
		c.Abort()
		return
	}
}
