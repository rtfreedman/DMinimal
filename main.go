package main

import (
	"flag"

	"github.com/rtfreedman/SpellTracker/api"
)

var port int
var dev bool

func main() {
	flag.IntVar(&port, "port", 8010, "Port to run API on")
	flag.BoolVar(&dev, "dev", false, "Run as dev/testing")
	api.RunAPI(port, dev)
}
