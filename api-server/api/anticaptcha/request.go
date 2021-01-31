package anticaptcha

import (
	"bytes"
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"
	"time"
)

func SolveCaptcha(url, proxy, sitekey, userAgnt, apiKey string) (string, error) {
	splitedProxy := strings.Split(proxy, ":")
	proxyPort, err := strconv.Atoi(splitedProxy[1])
	if err != nil {
		return "", err
	}
	createTaskRequest := CreateTask{
		ClientKey: apiKey,
		Task: CreateTaskDetail{
			Type:         "HCaptchaTask",
			WebsiteURL:   url,
			WebsiteKey:   sitekey,
			ProxyType:    "socks5",
			ProxyAddress: splitedProxy[0],
			ProxyPort:    proxyPort,
			UserAgent:    userAgnt,
		},
	}
	requestBytes, err := json.Marshal(createTaskRequest)
	if err != nil {
		return "", err
	}
	requestBuffer := bytes.NewBuffer(requestBytes)
	resp, err := http.Post("https://api.anti-captcha.com/createTask",
		"application/json", requestBuffer)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	responseBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}
	var createTaskResponse CreateTaskResponse
	err = json.Unmarshal(responseBytes, &createTaskResponse)
	if err != nil {
		return "", err
	}
	if createTaskResponse.ErrorID != 0 {
		return "", errors.New(strconv.Itoa(createTaskResponse.ErrorID))
	}

	time.Sleep(time.Second * 10)
	return checkCaptchaSolved(createTaskResponse.TaskID, apiKey)
}

func checkCaptchaSolved(taskID int, apiKey string) (string, error) {
	var taskResult GetTaskResultResponse
	getTaskRequest := GetTaskResult{
		ClientKey: apiKey,
		TaskID:    taskID,
	}
	requestBytes, err := json.Marshal(getTaskRequest)
	if err != nil {
		return "", err
	}
	requestBuffer := bytes.NewBuffer(requestBytes)
	for {
		resp, err := http.Post("https://api.anti-captcha.com/getTaskResult ",
			"application/json", requestBuffer)
		if err != nil {
			return "", err
		}
		defer resp.Body.Close()

		responseBytes, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			return "", err
		}
		err = json.Unmarshal(responseBytes, &taskResult)
		if err != nil {
			return "", err
		}
		if taskResult.ErrorID != 0 {
			return "", errors.New(strconv.Itoa(taskResult.ErrorID))
		}

		if taskResult.Status == "processing" {
			time.Sleep(time.Second * 3)
		} else {
			return taskResult.Solution.GRecaptchaResponse, nil
		}
	}
}
