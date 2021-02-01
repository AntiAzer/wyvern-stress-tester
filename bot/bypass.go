package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"
	"time"
)

func GetCookies(config Config, url, sitekey, userAgent string) ([]Cookie, error) {
	var solveJSON SolveJSON
	solveJSON.URL = url
	solveJSON.UserAgent = userAgent
	solveJSON.SiteKey = sitekey
	jsonBytes, err := json.Marshal(solveJSON)
	if err != nil {
		return nil, err
	}
	postData := bytes.NewBuffer(jsonBytes)
startSolving:
	request, err := http.NewRequest("POST", "http://localhost:8082/v1", postData)
	if err != nil {
		return nil, err
	}
	request.Header.Add("Content-Type", "application/json")
	request.Header.Set("User-Agent", config.userAgent)

	response, err := torHttpClient.Do(request)

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
