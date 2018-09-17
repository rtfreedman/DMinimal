package routines

import (
	"database/sql"
	"fmt"
	"log"
	"sort"
	"strings"

	// required for postgres driver
	_ "github.com/lib/pq"
)

var tiers = map[string]float64{
	"Bard": 1.0, "Cleric": 1.0, "Sorcerer": 1.0,
	"Wizard": 1.0, "Druid": 1.0, "Paladin": 0.5, "Ranger": 0.5,
	"Fighter (Eldritch Knight)": 0.333, "Rogue (Arcane Trickster)": 0.333,
}

var db = func() *sql.DB {
	connStr := "user=ryan dbname=dnd sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Could not connect to Postgres DB : " + err.Error())
	}
	return db
}()

var slots = map[int][]int{
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

// Class is a representation of the class of a character with level and classname populated
type Class struct {
	Level     int    `json:"level"`
	ClassName string `json:"class"`
}

// GetSlots return spell slots for class class at level level
func (c *Class) GetSlots() []int {
	_, classExists := tiers[c.ClassName]
	if _, levelExists := slots[c.Level]; !levelExists || !classExists {
		return []int{}
	}
	spellSlots := make([]int, len(slots[c.Level]))
	copy(spellSlots, slots[c.Level])
	for i := range spellSlots {
		spellSlot := int(tiers[c.ClassName] * float64(spellSlots[i]))
		spellSlots[i] = spellSlot
	}
	return spellSlots
}

// GetClassNames returns all classes that can use magic
func GetClassNames() []string {
	var classes []string
	for key := range tiers {
		classes = append(classes, key)
	}
	sort.Strings(classes)
	return classes
}

// SpellInfo contains information about spells
type SpellInfo struct {
	AtHigherLevels string `json:"AtHigherLevels"`
	classString    string
	Classes        []string `json:"Classes"`
	Level          int      `json:"Level"`
	Name           string   `json:"Name"`
	School         string   `json:"School"`
	SpellRange     string   `json:"SpellRange"`
	Components     string   `json:"Components"`
	CastingTime    string   `json:"CastingTime"`
	Description    string   `json:"Description"`
	Duration       string   `json:"Duration"`
}

// GetSpellInfo returns spell info on spell
func GetSpellInfo(spell string) (si SpellInfo, err error) {
	keys := []string{"classes", "athigherlevels", "level", "name", "range", "components", "school", "castingtime", "description", "duration"}
	// string,[]string,int,string,string,string,string,string,string
	query := "SELECT " + strings.Join(keys, ",") + " FROM spells WHERE name='" + spell + "';"
	fmt.Println(query)
	si = SpellInfo{}
	rows, err := db.Query(query)
	if err != nil {
		return
	}
	defer rows.Close()
	for rows.Next() {
		rows.Scan(&si.classString, &si.AtHigherLevels, &si.Level, &si.Name, &si.SpellRange, &si.Components, &si.School, &si.CastingTime, &si.Description, &si.Duration)
	}
	// because our db is kind of messed up for now
	si.classString = strings.Replace(si.classString, "{", "", -1)
	si.classString = strings.Replace(si.classString, "}", "", -1)
	si.Classes = strings.Split(si.classString, ",")
	return
}

// SpellSearch performs a search on the partial spell name name and in spell school for classes
func SpellSearch(name string, classes []string) ([]string, error) {
	// form query
	query := "SELECT name FROM spells WHERE name LIKE '%" + name + "%'"
	if len(classes) > 0 {
		classqueries := []string{}
		for _, class := range classes {
			classqueries = append(classqueries, "(classes @> ARRAY['"+class+"']::varchar[])")
		}
		query = query + " AND (" + strings.Join(classqueries, " OR ") + ")"
	}
	query += ";"
	// search db with constructed query
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	// gather names from returned data
	names := []string{}
	for rows.Next() {
		var name string
		rows.Scan(&name)
		names = append(names, name)
	}
	return names, nil
}
