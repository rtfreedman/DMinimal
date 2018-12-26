package routes

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rtfreedman/DMinimal/backend/store"
	"github.com/rtfreedman/DMinimal/backend/util"
)

// SetupStore sets up the admin functions for the store
func SetupStore(r *mux.Router) {
	r.HandleFunc("/api/store/resetCache", resetCache).Methods("GET") // TODO: auth admin only
}

func resetCache(w http.ResponseWriter, r *http.Request) {
	store.ResetClassSpellListCache()
	err := store.UpdateMonsterList()
	if err != nil {
		util.WriteError(err.Error(), w)
		return
	}
}
