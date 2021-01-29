package bot

import (
	"wyvern.pw/api/cloudproxy"
	"wyvern.pw/controllers/task"
)

type Bot struct {
	IP       string `json:"ip"`
	HWID     string `json:"hwid"`
	CPU      string `json:"cpu"`
	RAM      string `json:"ram"`
	OS       string `json:"os"`
	Username string `json:"username"`
	Status   string `json:"status"`
}

type Response struct {
	Code    int           `json:"code"`
	Message string        `json:"message"`
	Tasks   []task.Task   `json:"tasks"`
	Attacks []task.Attack `json:"attacks"`
}

type SolveRequest struct {
	Proxy     string `json:"proxy"`
	URL       string `json:"url"`
	UserAgent string `json:"userAgent"`
	SiteKey   string `json:"sitekey"`
}

type SolveResponse struct {
	Code    int                       `json:"code"`
	Message string                    `json:"message"`
	Cookies []cloudproxy.CookieStruct `json:"cookies"`
}
