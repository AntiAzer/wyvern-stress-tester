package task

type Response struct {
	Code    int      `json:"code"`
	Message string   `json:"message"`
	Tasks   []Task   `json:"tasks"`
	Attacks []Attack `json:"attacks"`
}

type Attack struct {
	ID               int    `json:"id"`
	AttackType       string `json:"attackType"`
	Method           string `json:"method"`
	TargetURL        string `json:"target"`
	Thread           int    `json:"thread"`
	Duration         int    `json:"duration"`
	Interval         int    `json:"interval"`
	Data             string `json:"data"`
	Accept           string `json:"accept"`
	AcceptEncoding   string `json:"acceptEncoding"`
	AcceptLanguage   string `json:"acceptLanguage"`
	UserAgent        string `json:"userAgent"`
	CustomHeader     string `json:"custom"`
	TargetExecution  int    `json:"targetExecution"`
	CurrentExecution int    `json:"currentExecution"`
}

type Task struct {
	ID               int    `json:"id"`
	TaskType         string `json:"taskType"`
	Parameter        string `json:"parameter"`
	TargetExecution  int    `json:"targetExecution"`
	CurrentExecution int    `json:"currentExecution"`
}
