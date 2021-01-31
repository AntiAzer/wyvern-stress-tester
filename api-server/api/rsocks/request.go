package rsocks

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"

	"wyvern.pw/config"
)

func GetSocksPort(tag string) (int, error) {
	resp, err := http.Get(fmt.Sprintf("http://%s/get/%s",
		config.REVERSE_SOCKS_HOSTNAME, tag))
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	bytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return 0, err
	}
	port, err := strconv.Atoi(string(bytes))
	if err != nil {
		return 0, err
	} else {
		return port, nil
	}
}