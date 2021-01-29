package cloudproxy

import (
	"bytes"
	"wyvern.pw/config"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

func GetCookie(url, proxy, userAgent, sitekey, apiKey string) ([]CookieStruct, error) {
	var request Request
	request.Command = "request.get"
	request.URL = url
	request.Proxy = proxy
	request.UserAgent = userAgent
	request.SiteKey = sitekey
	request.ApiKey = apiKey

	reqBytes, err := json.Marshal(request)
	if err != nil {
		return nil, err
	}
	reqBuffer := bytes.NewBuffer(reqBytes)
	client := http.Client{
		Timeout: 120 * time.Second,
	}
	resp, err := client.Post(fmt.Sprintf("http://%s:8082/v1",
		config.CLOUDPROXY_HOSTNAME), "application/json", reqBuffer)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	jsonBody, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	var solvedResp CloudproxyResponse
	err = json.Unmarshal(jsonBody, &solvedResp)
	if err != nil {
		return nil, err
	}
	if solvedResp.Status == "error" {
		return nil, errors.New(solvedResp.Message)
	}
	return solvedResp.Solution.Cookies, nil
}
