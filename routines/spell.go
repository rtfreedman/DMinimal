package routines

import (
	"database/sql"
	"fmt"
	"log"
	"math"
	"sort"
	"strings"

	// required for postgres driver
	_ "github.com/lib/pq"
)

var tiers = map[string]float64{
	"Bard": 1.0, "Cleric": 1.0, "Sorcerer": 1.0,
	"Wizard": 1.0, "Druid": 1.0, "Paladin": 0.5, "Ranger": 0.5,
	"Fighter (Eldritch Knight)": 0.333, "Rogue (Arcane Trickster)": 0.333,
	"Warlock": 0.1,
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
	if c.Level == 0 {
		return []int{0, 0, 0, 0, 0, 0, 0, 0, 0}
	}
	if c.ClassName == "Warlock" {
		ret := []int{0, 0, 0, 0, 0, 0, 0, 0, 0}
		slots := warlockSlots[c.Level]
		ret[slots.lvl-1] += slots.num
		return ret
	}
	spellSlots := make([]int, len(slots[c.Level]))
	copy(spellSlots, slots[c.Level])
	f := 1.0 / tiers[c.ClassName]
	level := int(math.Ceil(float64(c.Level) * tiers[c.ClassName]))
	if c.Level < int(f) {
		level = 0
	}
	return slots[level]
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
	AtHigherLevels string `json:"AtHigherLevels,omitempty"`
	classString    string
	Classes        []string `json:"Classes,omitempty"`
	Concentration  string   `json:"Concentration,omitempty"`
	Level          int      `json:"Level"`
	Name           string   `json:"Name"`
	School         string   `json:"School,omitempty"`
	SpellRange     string   `json:"SpellRange,omitempty"`
	Components     string   `json:"Components,omitempty"`
	CastingTime    string   `json:"CastingTime,omitempty"`
	Description    string   `json:"Description,omitempty"`
	Duration       string   `json:"Duration,omitempty"`
}

func (si *SpellInfo) clean() {
	si.AtHigherLevels = strings.TrimSpace(si.AtHigherLevels)
	si.Concentration = strings.TrimSpace(si.Concentration)
	si.Name = strings.TrimSpace(si.Name)
	si.School = strings.TrimSpace(si.School)
	si.SpellRange = strings.TrimSpace(si.SpellRange)
	si.Components = strings.TrimSpace(si.Components)
	si.CastingTime = strings.TrimSpace(si.CastingTime)
	si.Description = strings.TrimSpace(si.Description)
	si.Duration = strings.TrimSpace(si.Duration)
}

// GetSpellInfo returns spell info on spell
func GetSpellInfo(spell string) (si SpellInfo, err error) {
	keys := []string{"classes", "athigherlevels", "level", "name", "range", "components", "school", "castingtime", "description", "duration", "concentration"}
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
		rows.Scan(&si.classString, &si.AtHigherLevels, &si.Level, &si.Name, &si.SpellRange, &si.Components, &si.School, &si.CastingTime, &si.Description, &si.Duration, &si.Concentration)
	}
	// because our db is kind of messed up for now
	si.classString = strings.Replace(si.classString, "{", "", -1)
	si.classString = strings.Replace(si.classString, "}", "", -1)
	si.Classes = strings.Split(si.classString, ",")
	si.clean()
	return
}

// SpellSearch performs a search on the partial spell name name and in spell school for classes
func SpellSearch(name string, classes []string) ([]string, error) {
	for i := range classes {
		// arcane trickster and eldritch knight learn from the wizard school of magic
		// although there are some restrictions to which schools the spells must come, ultimately there is no
		// broad restriction preventin them from learning any wizard spell
		if classes[i] == "Rogue (Arcane Trickster)" || classes[i] == "Fighter (Eldritch Knight)" {
			classes[i] = "Wizard"
		}
	}
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
