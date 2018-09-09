package routes

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rtfreedman/SpellTracker/routines"
	"github.com/rtfreedman/SpellTracker/util"
)

// SetupSpells sets up the handler funcs for API requests for the /magic/ location
func SetupSpells(r *mux.Router) {
	r.HandleFunc("/magic/slots/", getSpellSlots).Methods("POST")
	r.HandleFunc("/magic/classes/", getMagicClasses).Methods("GET")
}

func getSpellSlots(w http.ResponseWriter, r *http.Request) {
	// we won't need this struct anywhere else so we'll define it here
	var req []routines.Class
	util.ReadJSONRequestBody(r, &req)
	var resp map[string][]int
	resp["Slots"] = []int{}
	for c := range req {
		resp["Slots"] = util.AddIntSlices(resp["Slots"], req[c].GetSlots())
	}
	util.WriteJSONResponse("getSpellSlots", resp, w)
	return
}

func getMagicClasses(w http.ResponseWriter, r *http.Request) {
	var classes map[string][]string
	classes["Classes"] = routines.GetClassNames()
	util.WriteJSONResponse("getMagicClasses", classes, w)
}
