package main

import (
	"encoding/binary"
	"os"
	"strings"
)

type Config struct {
	domain    string
	interval  int32
	userAgent string

	install  bool
	registry bool
}

func (c *Config) Init() error {
	filename, err := os.Executable()
	if err != nil {
		return err
	}
	f, err := os.Open(filename)
	if err != nil {
		return err
	}
	defer f.Close()

	buf := make([]byte, 318)
	stat, err := os.Stat(filename)
	start := stat.Size() - 318
	_, err = f.ReadAt(buf, start)
	if err != nil {
		return err
	}
	c.ParseBuffer(buf)
	return err
}

func (c *Config) ParseBuffer(buf []byte) {
	for i := 0; i < len(buf); i++ {
		buf[i] ^= 0x69
	}
	c.domain = strings.Trim(string(buf[:56]), "\x00")
	c.userAgent = strings.Trim(string(buf[56:312]), "\x00")
	c.interval = int32(binary.BigEndian.Uint32(buf[312:316]))
	if buf[316] == 0x00 {
		c.install = false
	} else {
		c.install = true
	}
	if buf[317] == 0x00 {
		c.registry = false
	} else {
		c.registry = true
	}
}
