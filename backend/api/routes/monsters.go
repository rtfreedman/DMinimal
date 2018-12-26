package routes

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rtfreedman/DMinimal/backend/store"
	"github.com/rtfreedman/DMinimal/backend/util"
)

// SetupMonsters attaches the monster routes
func SetupMonsters(r *mux.Router) {
	r.HandleFunc("/api/monsters", getMonstersList).Methods("GET")
	r.HandleFunc("/api/monsters/{monster}", getMonsterInfo).Methods("Get")
}

func getMonstersList(w http.ResponseWriter, r *http.Request) {
	monsters := store.GetMonsters()
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
	monster, err := store.GetMonster(vars["monster"])
	if err != nil {
		util.WriteError(err.Error(), w)
		return
	}
	util.WriteJSONResponse("getMonsterInfo", monster, w)
}

func updateMonsterCache(w http.ResponseWriter, r *http.Request) {
	// TODO auth admin only
	err := store.UpdateMonsterList()
	if err != nil {
		util.WriteError(err.Error(), w)
		return
	}
}
