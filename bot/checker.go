package main

import (
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"regexp"
	"strings"
	"time"
)

func (a *Attacker) BuildCheckerRequest() (*http.Request, error) {
	var request *http.Request
	var err error
	request, err = http.NewRequest("GET", a.attack.TargetURL, nil)
	if err != nil {
		return nil, err
	}
	request.Header.Add("Connection", "keep-alive")
	request.Header.Add("Cache-Control", "no-cache")
	request.Header.Add("DNT", "1")
	request.Header.Add("Upgrade-Insecure-Requests", "1")
	request.Header.Add("User-Agent", a.userAgent)
	request.Header.Add("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9")
	request.Header.Add("Sec-Fetch-Site", "none")
	request.Header.Add("Sec-Fetch-Mode", "navigate")
	request.Header.Add("Sec-Fetch-User", "?1")
	request.Header.Add("Sec-Fetch-Dest", "document")
	request.Header.Add("Accept-Language", "en-US,en;q=0.9,ko-KR;q=0.8,ko;q=0.7,de;q=0.6,ar;q=0.5,pt;q=0.4,ja;q=0.3,fr;q=0.2")
	if len(a.cookies) > 0 {
		for _, cookie := range a.cookies {
			request.AddCookie(&http.Cookie{Name: cookie.Name, Value: cookie.Value})
		}
	}
	return request, nil
}

func (a *Attacker) CheckResponse(expired chan bool) {
	exit := false
	go func() {
		exit = <-expired
	}()
	tr := &http.Transport{
		MaxIdleConns:       10,
		IdleConnTimeout:    30 * time.Second,
		DisableCompression: true,
	}
	var client = new(http.Client)
	if strings.Contains(a.attack.TargetURL, "http://") {
		client = new(http.Client)
	} else {
		client = &http.Client{Transport: tr}
	}
	for {
		if exit {
			break
		}
		request, err := a.BuildCheckerRequest()
		if err != nil {
			time.Sleep(time.Second)
			continue
		}
		r, err := client.Do(request)
		if err != nil {
			time.Sleep(time.Second)
			continue
		}

		title, err := GetHtmlTitle(r.Body)
		if err != nil {
			time.Sleep(time.Second)
			r.Body.Close()
			continue
		}
		fmt.Println(r.StatusCode, title)
		if r.StatusCode == 403 {
			a.SolveCookie()
		} else if r.StatusCode == 503 {
			if title == "Just a moment..." {
				a.SolveCookie()
			}
		} else if r.StatusCode == 200 {
			if title == "Attention Required! | Cloudflare" || title == "Please Wait... | Cloudflare" {
				a.SolveCookie()
			}
		}
		r.Body.Close()
		time.Sleep(time.Second)
	}
}

func GetHtmlTitle(r io.Reader) (string, error) {
	data, err := ioutil.ReadAll(r)
	if err != nil {
		return "", err
	}
	regex, _ := regexp.Compile("<title>(.*)</title>")
	res := regex.FindStringSubmatch(string(data))
	if len(res) == 2 {
		return res[1], nil
	} else {
		return "", nil
	}
}
