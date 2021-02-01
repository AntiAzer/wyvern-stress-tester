module api-server

go 1.14

require (
	github.com/dgrijalva/jwt-go v3.2.0+incompatible // indirect
	github.com/gin-gonic/gin v1.6.3 // indirect
	github.com/mackerelio/go-osstat v0.1.0 // indirect
	github.com/mattn/go-sqlite3 v1.14.6 // indirect
	github.com/ricochet2200/go-disk-usage v0.0.0-20150921141558-f0d1b743428f // indirect
	wyvern.pw/config v1.0.0
	wyvern.pw/controllers v1.0.0
	wyvern.pw/data v1.0.0
	wyvern.pw/middlewares v1.0.0
	wyvern.pw/server v1.0.0
)

replace (
	wyvern.pw/config v1.0.0 => ./config
	wyvern.pw/controllers v1.0.0 => ./controllers
	wyvern.pw/data v1.0.0 => ./data
	wyvern.pw/middlewares v1.0.0 => ./middlewares
	wyvern.pw/server v1.0.0 => ./server
)
