package status

type Request struct {
	Type string `json:"type"`
}

type Response struct {
	Code  int    `json:"code"`
	Value string `json:"value"`
}

type BotListResponse struct {
	Code  int   `json:"code"`
	Count int   `json:"count"`
	Bots  []Bot `json:"bots"`
}

type Bot struct {
	IP       string `json:"ip"`
	HWID     string `json:"hwid"`
	CPU      string `json:"cpu"`
	RAM      string `json:"ram"`
	OS       string `json:"os"`
	Username string `json:"username"`
	Status   string `json:"status"`
}
