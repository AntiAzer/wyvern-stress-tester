package cloudproxy

type CookieStruct struct {
	Name  string `json:"name"`
	Value string `json:"value"`
}

type SolutionStruct struct {
	Cookies []CookieStruct `json:"cookies"`
}

type CloudproxyResponse struct {
	Status   string         `json:"status"`
	Message  string         `json:"message"`
	Solution SolutionStruct `json:"solution"`
}

type Request struct {
	Command   string `json:"cmd"`
	URL       string `json:"url"`
	Proxy     string `json:"proxy"`
	UserAgent string `json:"userAgent"`
	SiteKey   string `json:"sitekey"`
	ApiKey    string `json:"apiKey"`
}
