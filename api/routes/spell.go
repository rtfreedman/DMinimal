package routes

import (
	"net/http"

	"github.com/gorilla/mux"
)

// SetupSpells sets up the handler funcs for API requests for the /spells/ location
func SetupSpells(r *mux.Router) {
	r.HandleFunc("/spells/slots/", getSpellSlots).Methods("POST")
}

func getSpellSlots(w http.ResponseWriter, r *http.Request) {
	return
}
