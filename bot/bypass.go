package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

func GetCookies(config Config, url, sitekey, userAgent, tag string) ([]Cookie, error) {
	var solveJSON SolveJSON
	solveJSON.Tag = tag
	solveJSON.URL = url
	solveJSON.UserAgent = userAgent
	solveJSON.SiteKey = sitekey
	jsonBytes, err := json.Marshal(solveJSON)
	if err != nil {
		return nil, err
	}
	postData := bytes.NewBuffer(jsonBytes)
startSolving:
	request, err := http.NewRequest("POST",
		fmt.Sprintf("http://%s:88/api/docking/solve", config.domain), postData)
	if err != nil {
		return nil, err
	}
	request.Header.Add("Content-Type", "application/json")
	request.Header.Set("User-Agent", config.userAgent)

	client := &http.Client{}
	response, err := client.Do(request)

	responseBody, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}
	var solveResponse SolveResponse
	err = json.Unmarshal(responseBody, &solveResponse)
	if err != nil {
		return nil, err
	}
	if solveResponse.Code == http.StatusTooManyRequests {
		time.Sleep(time.Second * 10)
		goto startSolving
	} else if solveResponse.Code != http.StatusOK {
		return nil, errors.New(solveResponse.Message)
	}

	return solveResponse.Cookies, nil
}
