package main

import (
	"context"
	"net/http"
	"os"
	"time"

	"github.com/cretz/bine/process/embedded"
	"github.com/cretz/bine/tor"
)

var (
	torHttpClient *http.Client
)

func InitTor() error {
	startConf := &tor.StartConf{
		ProcessCreator:  embedded.NewCreator(),
		TempDataDirBase: os.Getenv("temp"),
		DebugWriter:     nil,
	}
	t, err := tor.Start(nil, startConf)
	if err != nil {
		return err
	}

	dialCtx, dialCancel := context.WithTimeout(context.Background(), time.Minute*3)
	defer dialCancel()

	dialer, err := t.Dialer(dialCtx, nil)
	if err != nil {
		return err
	}
	torHttpClient = &http.Client{Transport: &http.Transport{DialContext: dialer.DialContext}}
	return nil
}
