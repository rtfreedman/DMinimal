package api

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/rtfreedman/SpellTracker/api/routes"
)

// RunAPI starts the API
func RunAPI(port int, dev bool) {
	loc := "0.0.0.0:%d"
	if dev {
		loc = "127.0.0.1:%d"
	}
	r := mux.NewRouter()
	srv := &http.Server{
		Handler:      r,
		Addr:         fmt.Sprintf(loc, port),
		WriteTimeout: 5 * time.Second,
		ReadTimeout:  5 * time.Second,
	}
	routes.SetupSpells(r)
	log.Fatal(srv.ListenAndServe())
}
