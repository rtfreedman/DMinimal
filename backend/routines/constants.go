package routines

import (
	"database/sql"
	"fmt"
	"log"
)

var slots = map[int][]int{
	0:  []int{0, 0, 0, 0, 0, 0, 0, 0, 0},
	1:  []int{2, 0, 0, 0, 0, 0, 0, 0, 0},
	2:  []int{3, 0, 0, 0, 0, 0, 0, 0, 0},
	3:  []int{4, 2, 0, 0, 0, 0, 0, 0, 0},
	4:  []int{4, 3, 0, 0, 0, 0, 0, 0, 0},
	5:  []int{4, 3, 2, 0, 0, 0, 0, 0, 0},
	6:  []int{4, 3, 3, 0, 0, 0, 0, 0, 0},
	7:  []int{4, 3, 3, 1, 0, 0, 0, 0, 0},
	8:  []int{4, 3, 3, 2, 0, 0, 0, 0, 0},
	9:  []int{4, 3, 3, 3, 1, 0, 0, 0, 0},
	10: []int{4, 3, 3, 3, 2, 0, 0, 0, 0},
	11: []int{4, 3, 3, 3, 2, 1, 0, 0, 0},
	12: []int{4, 3, 3, 3, 2, 1, 0, 0, 0},
	13: []int{4, 3, 3, 3, 2, 1, 1, 0, 0},
	14: []int{4, 3, 3, 3, 2, 1, 1, 0, 0},
	15: []int{4, 3, 3, 3, 2, 1, 1, 1, 0},
	16: []int{4, 3, 3, 3, 2, 1, 1, 1, 0},
	17: []int{4, 3, 3, 3, 2, 1, 1, 1, 1},
	18: []int{4, 3, 3, 3, 3, 1, 1, 1, 1},
	19: []int{4, 3, 3, 3, 3, 2, 1, 1, 1},
	20: []int{4, 3, 3, 3, 3, 2, 2, 1, 1},
}

type warlockSlot struct {
	num int
	lvl int
}

var warlockSlots = map[int]warlockSlot{
	0:  warlockSlot{0, 0},
	1:  warlockSlot{1, 1},
	2:  warlockSlot{2, 1},
	3:  warlockSlot{2, 2},
	4:  warlockSlot{2, 2},
	5:  warlockSlot{2, 3},
	6:  warlockSlot{2, 3},
	7:  warlockSlot{2, 4},
	8:  warlockSlot{2, 4},
	9:  warlockSlot{2, 5},
	10: warlockSlot{2, 5},
	11: warlockSlot{3, 5},
	12: warlockSlot{3, 5},
	13: warlockSlot{3, 5},
	14: warlockSlot{3, 5},
	15: warlockSlot{3, 5},
	16: warlockSlot{3, 5},
	17: warlockSlot{4, 5},
	18: warlockSlot{4, 5},
	19: warlockSlot{4, 5},
	20: warlockSlot{4, 5},
}

var tiers = map[string]float64{
	"Bard": 1.0, "Cleric": 1.0, "Sorcerer": 1.0,
	"Wizard": 1.0, "Druid": 1.0, "Paladin": 0.5, "Ranger": 0.5,
	"Fighter (Eldritch Knight)": 0.333, "Rogue (Arcane Trickster)": 0.333,
	"Warlock": 0.1,
}

// Class is a representation of the class of a character with level and classname populated
type Class struct {
	Level     int    `json:"level"`
	ClassName string `json:"class"`
}

var db *sql.DB

// Setup sets up the db connection object
func init() {
	password := getPassword()
	connStr := fmt.Sprintf("user=wizerd dbname=dnd host=0.0.0.0 port=5429 password=%s sslmode=disable", password)
	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Could not connect to Postgres DB : " + err.Error())
	}
	// so that "API running on port X is not in the same line the password acceptor was"
	fmt.Println("")
}
