package routes

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rtfreedman/DMinimal/backend/routines"
	"github.com/rtfreedman/DMinimal/backend/util"
)

// SetupMonsters attaches the monster routes
func SetupMonsters(r *mux.Router) {
	r.HandleFunc("/monsters", getMonstersList).Methods("GET")
	r.HandleFunc("/monsters/{monster}", getMonsterInfo)
}

func getMonstersList(w http.ResponseWriter, r *http.Request) {
	monsters, err := routines.GetMonsters()
	if err != nil {
		util.WriteError("Could not get monster list", w)
		return
	}
	util.WriteJSONResponse("getMonsters", map[string]interface{}{
		"Monsters": monsters,
	}, w)
}

func getMonsterInfo(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	if _, ok := vars["monster"]; !ok {
		util.WriteError("No monster supplied", w)
		return
	}
	// mi, err := routines.GetMonsterInfo(vars["monster"])
}
