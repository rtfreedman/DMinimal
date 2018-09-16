package routes

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rtfreedman/SpellTracker/routines"
	"github.com/rtfreedman/SpellTracker/util"
)

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

// SetupSpells sets up the handler funcs for API requests for the /magic/ location
func SetupSpells(r *mux.Router) {
	r.HandleFunc("/magic/slots/", getSpellSlots).Methods("POST")
	r.HandleFunc("/magic/classes/", getMagicClasses).Methods("GET")
}

func getSpellSlots(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	// we won't need this struct anywhere else so we'll define it here
	req := map[string][]routines.Class{}
	util.ReadJSONRequestBody(r, &req)
	resp := map[string]interface{}{}
	if _, ok := req["classes"]; !ok {
		util.WriteError("Malformed JSON input into getSpellSlots API endpoint", w)
	}
	slots := []int{}
	for c := range req["classes"] {
		slots = util.AddIntSlices(slots, req["classes"][c].GetSlots())
	}
	resp["Slots"] = util.TransformToMapSlice(slots)
	util.WriteJSONResponse("getSpellSlots", resp, w)
	return
}

func getMagicClasses(w http.ResponseWriter, r *http.Request) {
	classes := map[string][]string{}
	classes["Classes"] = routines.GetClassNames()
	enableCors(&w)
	util.WriteJSONResponse("getMagicClasses", classes, w)
}
