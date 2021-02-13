package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"
	"strings"
	"time"
)

func GetCookies(url, customHeader, userAgent string) ([]Cookie, error) {
	splitedCustomHeader := strings.Split(customHeader, ";")

	var solveJSON SolveJSON
	solveJSON.Command = "request.get"
	solveJSON.URL = strings.Split(url, "://")[0] + "://" + strings.Split(strings.Split(url, "://")[1], "/")[0]
	solveJSON.UserAgent = userAgent
	solveJSON.SiteKey = splitedCustomHeader[0]
	solveJSON.ApiKey = splitedCustomHeader[1]
	jsonBytes, err := json.Marshal(solveJSON)
	if err != nil {
		return nil, err
	}
	postData := bytes.NewBuffer(jsonBytes)

	request, err := http.NewRequest("POST", "http://localhost:8082/v1", postData)
	if err != nil {
		return nil, err
	}
	request.Header.Add("Content-Type", "application/json")

	client := http.Client{
		Timeout: time.Minute * 5,
	}
	response, err := client.Do(request)
	if err != nil {
		return nil, err
	}

	responseBody, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}
	var solveResponse SolveResponse
	err = json.Unmarshal(responseBody, &solveResponse)
	if err != nil {
		return nil, err
	}
	if solveResponse.Status != "ok" {
		return nil, errors.New(solveResponse.Message)
	}
	return solveResponse.Solution.Cookies, nil
}
