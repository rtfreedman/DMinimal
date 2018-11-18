package routes

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rtfreedman/DMinimal/backend/routines"
	"github.com/rtfreedman/DMinimal/backend/util"
)

// SetupWeapons sets up the handler funcs for API requests for the /items/weapons/ location
func SetupWeapons(r *mux.Router) {
	r.HandleFunc("/api/items/weapons/{weaponName}", getWeaponInformation).Methods("GET")
	r.HandleFunc("/api/items/weapons", getWeapons).Methods("GET")
}

func getWeaponInformation(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	if _, ok := vars["weaponName"]; !ok {
		util.WriteError("No weapon supplied", w)
		return
	}
	weaponInfo, err := routines.GetWeaponInfo(vars["weaponName"])
	if err != nil {
		util.WriteError(err.Error(), w)
		return
	}
	util.WriteJSONResponse("getWeaponInformation", weaponInfo, w)
}

func getWeapons(w http.ResponseWriter, r *http.Request) {
	weapons, err := routines.GetWeapons()
	if err != nil {
		util.WriteError(err.Error(), w)
		return
	}
	util.WriteJSONResponse("getWeaponInformation", weapons, w)
}
