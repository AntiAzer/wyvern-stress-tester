package main

import (
	"github.com/armon/go-socks5"
	"github.com/hashicorp/yamux"
	"net"
	"time"
)

func ConnectForSocks(conn net.Conn, tag string, ch chan bool) error {
	var session *yamux.Session
	server, err := socks5.New(&socks5.Config{})
	if err != nil {
		return err
	}

	conn.Write([]byte(tag))
	time.Sleep(time.Second * 5)
	session, err = yamux.Server(conn, nil)
	if err != nil {
		return err
	}

	var exit bool
	go func() {
		exit = <-ch
	}()

	for {
		if exit {
			return nil
		}
		stream, err := session.Accept()
		if err != nil {
			return err
		}
		go func() {
			server.ServeConn(stream)
		}()
	}
}
