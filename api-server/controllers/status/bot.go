package status

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	cSetting "wyvern.pw/controllers/setting"
	"wyvern.pw/data"
)

var botList []Bot

func InitStatusController() {
	go updateBotList()
}

func updateBotList() {
	for {
		botList, _ = getBotList()
		time.Sleep(time.Second * 5)
	}
}

func GetBotStatus(c *gin.Context) {
	statusType := c.Query("type")
	switch statusType {
	case "os":
		var windows10, windows7, other int
		for _, bot := range botList {
			switch bot.OS {
			case "Windows 10":
				windows10++
			case "Windows 7":
				windows7++
			default:
				other++
			}
		}
		c.JSON(http.StatusOK, Response{
			Code: http.StatusOK,
			Value: strconv.Itoa(windows10) + "/" + strconv.Itoa(windows7) + "/" +
				strconv.Itoa(other),
		})
		c.Abort()
		return
	case "status":
		var online, offline int
		for _, bot := range botList {
			switch bot.Status {
			case "Online":
				online++
			case "Offline":
				offline++
			}
		}
		c.JSON(http.StatusOK, Response{
			Code:  http.StatusOK,
			Value: strconv.Itoa(online) + "/" + strconv.Itoa(offline),
		})
		c.Abort()
		return
	case "privilege":
		var user, admin int
		for _, bot := range botList {
			switch bot.Username {
			case "Administrator":
				admin++
			default:
				user++
			}
		}
		c.JSON(http.StatusOK, Response{
			Code:  http.StatusOK,
			Value: strconv.Itoa(user) + "/" + strconv.Itoa(admin),
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

func GetBotList(c *gin.Context) {
	botList, err := getBotList()
	if err != nil {
		c.JSON(http.StatusOK, Response{
			Code:  http.StatusInternalServerError,
			Value: err.Error(),
		})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, BotListResponse{
		Code:  http.StatusOK,
		Count: len(botList),
		Bots:  botList,
	})
	c.Abort()
	return
}

func getBotList() ([]Bot, error) {
	db, err := data.GetConnection()
	if err != nil {
		return nil, err
	}
	rows, err := db.Query("SELECT * FROM bots")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var botList []Bot
	var lastResponse string
	interval, err := cSetting.GetBotInterval()
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var bot Bot
		err := rows.Scan(&bot.IP, &bot.HWID, &bot.CPU, &bot.RAM,
			&bot.OS, &bot.Username, &lastResponse)
		if err != nil {
			return nil, err
		}
		lastResponseTime, err := time.Parse("2006-01-02 15:04:05", lastResponse)
		if err != nil {
			return nil, err
		}
		timeDifference := int(time.Now().Sub(lastResponseTime).Seconds())
		if timeDifference < interval {
			bot.Status = "Online"
		} else {
			bot.Status = "Offline"
		}
		botList = append(botList, bot)
	}
	return botList, nil
}
