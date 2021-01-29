package setting

type UpdateRequest struct {
	Name  string `json:"name"`
	Value string `json:"value"`
}

type Response struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}
