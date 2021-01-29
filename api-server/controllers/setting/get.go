package setting

import (
	"wyvern.pw/data"
)

func GetBotUserAgent() (string, error) {
	db, err := data.GetConnection()
	if err != nil {
		return "", err
	}

	var userAgent string
	err = db.QueryRow("SELECT value FROM setting WHERE name='user-agent'").Scan(&userAgent)
	if err != nil {
		return "", err
	}
	return userAgent, nil
}

func GetBotInterval() (int, error) {
	db, err := data.GetConnection()
	if err != nil {
		return 0, err
	}

	var interval int
	err = db.QueryRow("SELECT value FROM setting WHERE name='interval'").Scan(&interval)
	if err != nil {
		return 0, err
	}
	return interval + 10, nil
}

func GetApiKey() (string, error) {
	db, err := data.GetConnection()
	if err != nil {
		return "", err
	}

	var apiKey string
	err = db.QueryRow("SELECT value FROM setting WHERE name='api-key'").Scan(&apiKey)
	if err != nil {
		return "", err
	}
	return apiKey, nil
}

func GetIP() (string, error) {
	db, err := data.GetConnection()
	if err != nil {
		return "", err
	}

	var ip string
	err = db.QueryRow("SELECT value FROM setting WHERE name='ip'").Scan(&ip)
	if err != nil {
		return "", err
	}
	return ip, nil
}
