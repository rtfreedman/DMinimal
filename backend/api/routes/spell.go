package routes

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rtfreedman/DMinimal/backend/routines"
	"github.com/rtfreedman/DMinimal/backend/util"
)

// SetupSpells sets up the handler funcs for API requests for the /magic/ location
func SetupSpells(r *mux.Router) {
	r.HandleFunc("/magic/spells/{spellname}", getSpellInformation).Methods("GET")
	r.HandleFunc("/magic/spells", getSpellList).Methods("GET")
	r.HandleFunc("/magic/slots", getSpellSlots).Methods("POST")
	r.HandleFunc("/classes", getClasses).Methods("GET")
}

func getSpellInformation(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	if _, ok := vars["spellname"]; !ok {
		util.WriteError("No spellname supplied", w)
		return
	}
	si, err := routines.GetSpellInfo(vars["spellname"])
	if err != nil {
		util.WriteError(err.Error(), w)
		return
	}
	util.WriteJSONResponse("getSpellInformation", si, w)
}

func getSpellList(w http.ResponseWriter, r *http.Request) {
	spells, err := routines.SpellList()
	if err != nil {
		util.WriteError(err.Error(), w)
		return
	}
	util.WriteJSONResponse("getSearch", map[string][]string{
		"spellOpts": spells,
	}, w)
	return
}

func getSpellSlots(w http.ResponseWriter, r *http.Request) {
	req := map[string][]routines.Class{}
	err := util.ReadJSONRequestBody(r, &req)
	if err != nil {
		util.WriteError("Malformed JSON input into getSpellSlots API endpoint", w)
		return
	}
	slots := []int{}
	for c := range req["classes"] {
		slots = util.AddIntSlices(slots, req["classes"][c].GetSlots())
	}
	util.WriteJSONResponse("getSpellSlots", map[string]map[int]int{
		"Slots": util.TransformToMapSlice(slots),
	}, w)
	return
}

func getClasses(w http.ResponseWriter, r *http.Request) {
	classes := map[string][]string{}
	classes["Classes"], classes["MagicClasses"] = routines.GetClassNames()
	util.WriteJSONResponse("getClasses", classes, w)
}
