package task

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"wyvern.pw/data"
)

func GetHistory(c *gin.Context) {
	taskType := c.Query("type")
	switch taskType {
	case "attack":
		attacks, err := GetAttacks()
		if err != nil {
			if err != nil {
				fmt.Println(err)
				c.JSON(http.StatusOK, Response{
					Code:    http.StatusInternalServerError,
					Message: err.Error(),
				})
				c.Abort()
				return
			}
		}
		c.JSON(http.StatusOK, Response{
			Code:    http.StatusOK,
			Message: "",
			Attacks: attacks,
		})
		c.Abort()
		return
	case "task":
		tasks, err := GetTasks()
		if err != nil {
			if err != nil {
				c.JSON(http.StatusOK, Response{
					Code:    http.StatusInternalServerError,
					Message: err.Error(),
				})
				c.Abort()
				return
			}
		}
		c.JSON(http.StatusOK, Response{
			Code:    http.StatusOK,
			Message: "",
			Tasks:   tasks,
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

func GetAttacks() ([]Attack, error) {
	db, err := data.GetConnection()
	if err != nil {
		return nil, err
	}
	rows, err := db.Query("SELECT * FROM attack")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var attacks []Attack
	for rows.Next() {
		var attack Attack
		err = rows.Scan(&attack.ID, &attack.AttackType, &attack.Method, &attack.TargetURL,
			&attack.Thread, &attack.Duration, &attack.Interval, &attack.Data, &attack.Accept,
			&attack.AcceptEncoding, &attack.AcceptLanguage, &attack.UserAgent,
			&attack.CustomHeader, &attack.TargetExecution, &attack.CurrentExecution)
		if err != nil {
			return nil, err
		}
		attacks = append(attacks, attack)
	}
	return attacks, nil
}

func GetTasks() ([]Task, error) {
	db, err := data.GetConnection()
	if err != nil {
		return nil, err
	}
	rows, err := db.Query("SELECT * FROM task")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks []Task
	for rows.Next() {
		var task Task
		err = rows.Scan(&task.ID, &task.TaskType, &task.Parameter,
			&task.TargetExecution, &task.CurrentExecution)
		if err != nil {
			return nil, err
		}
		tasks = append(tasks, task)
	}
	return tasks, nil
}
