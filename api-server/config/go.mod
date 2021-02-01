module config

go 1.14

require (
	wyvern.pw/config v1.0.0
	wyvern.pw/controllers v1.0.0
	wyvern.pw/data v1.0.0
	wyvern.pw/middlewares v1.0.0
	wyvern.pw/server v1.0.0
)

replace (
	wyvern.pw/config v1.0.0 => ../config
	wyvern.pw/controllers v1.0.0 => ../controllers
	wyvern.pw/data v1.0.0 => ../data
	wyvern.pw/middlewares v1.0.0 => ../middlewares
	wyvern.pw/server v1.0.0 => ../server
)