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
	r.HandleFunc("/magic/search/", getSearch).Methods("POST")
	r.HandleFunc("/magic/slots/", getSpellSlots).Methods("POST")
	r.HandleFunc("/magic/classes/", getMagicClasses).Methods("GET")
}

func getSearch(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	req := struct {
		Classes       []string `json:"classes"`
		SpellNamePart string   `json:"spellName"`
	}{}
	err := util.ReadJSONRequestBody(r, &req)
	if err != nil {
		util.WriteError("Malformed JSON input into getSearch API endpoint", w)
	}
	spellOpts, err := routines.SpellSearch(req.SpellNamePart, req.Classes)
	if err != nil {
		util.WriteError(err.Error(), w)
	}
	util.WriteJSONResponse("getSearch", map[string][]string{
		"spellOpts": spellOpts,
	}, w)
	return
}

func getSpellSlots(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	req := map[string][]routines.Class{}
	err := util.ReadJSONRequestBody(r, &req)
	if err != nil {
		util.WriteError("Malformed JSON input into getSpellSlots API endpoint", w)
	}
	slots := []int{}
	for c := range req["classes"] {
		slots = util.AddIntSlices(slots, req["classes"][c].GetSlots())
	}
	util.WriteJSONResponse("getSpellSlots", map[string][]map[string]int{
		"Slots": util.TransformToMapSlice(slots),
	}, w)
	return
}

func getMagicClasses(w http.ResponseWriter, r *http.Request) {
	classes := map[string][]string{}
	classes["Classes"] = routines.GetClassNames()
	enableCors(&w)
	util.WriteJSONResponse("getMagicClasses", classes, w)
}
