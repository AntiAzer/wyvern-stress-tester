package anticaptcha

type CreateTask struct {
	ClientKey string           `json:"clientKey"`
	Task      CreateTaskDetail `json:"task"`
}

type CreateTaskDetail struct {
	Type         string `json:"type"`
	WebsiteURL   string `json:"websiteURL"`
	WebsiteKey   string `json:"websiteKey"`
	ProxyType    string `json:"proxyType"`
	ProxyAddress string `json:"proxyAddress"`
	ProxyPort    int    `json:"proxyPort"`
	UserAgent    string `json:"userAgent"`
}

type CreateTaskResponse struct {
	ErrorID int `json:"errorId"`
	TaskID  int `json:"taskId"`
}

type GetTaskResult struct {
	ClientKey string `json:"clientKey"`
	TaskID    int    `json:"taskId"`
}

type GetTaskResultResponse struct {
	ErrorID  int              `json:"errorId"`
	Status   string           `json:"status"`
	Solution HCaptchaSolution `json:"solution"`
}

type HCaptchaSolution struct {
	GRecaptchaResponse string `json:"gRecaptchaResponse"`
}
