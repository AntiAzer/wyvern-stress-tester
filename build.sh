GOOS=windows GOARCH=amd64 go build -ldflags="-s -H=windowsgui" -o ../stub ./bot
go build -o ../builder ./builder