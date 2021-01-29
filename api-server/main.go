package main

import (
	"wyvern.pw/server"
)

func main() {
	server.Start()
	defer server.Clear()
}
