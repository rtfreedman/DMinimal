package routines

import (
	"errors"
	"fmt"
	"log"
	"math"
	"sort"
	"strings"
	"syscall"

	// required for postgres driver
	_ "github.com/lib/pq"
	"golang.org/x/crypto/ssh/terminal"
)

func getPassword() string {
	fmt.Print("Postgres Password: ")
	bytePassword, err := terminal.ReadPassword(int(syscall.Stdin))
	if err != nil {
		log.Fatal("Error getting postgres terminal password")
	}
	password := string(bytePassword)
	return password
}

// GetSlots return spell slots for class class at level level
func (c *Class) GetSlots() []int {
	_, classExists := tiers[c.ClassName]
	if _, levelExists := slots[c.Level]; !levelExists || !classExists || c.Level == 0 {
		return slots[0]
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
func GetClassNames() ([]string, []string) {
	// add non-magic classes
	magicClasses := []string{}
	for key := range tiers {
		magicClasses = append(magicClasses, key)
	}
	allClasses := append([]string{"Barbarian", "Fighter", "Rogue", "Monk"}, magicClasses...)
	sort.Strings(magicClasses)
	sort.Strings(allClasses)
	return allClasses, magicClasses
}

// SpellInfo contains information about spells
type SpellInfo struct {
	AtHigherLevels string `json:"AtHigherLevels,omitempty"`
	classString    string
	Classes        []string `json:"Classes,omitempty"`
	Concentration  bool     `json:"Concentration,omitempty"`
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
	query := "SELECT " + strings.Join(keys, ",") + " FROM spells WHERE name=$1"
	si = SpellInfo{}
	rows, err := db.Query(query, spell)
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

// SpellList returns a list of all spells
func SpellList(class string) (ret []string, err error) {
	if _, ok := tiers[class]; !ok {
		err = errors.New("Non-magical class submitted to SpellList API endpoint")
		return
	}
	if class == "Fighter (Eldritch Knight)" || class == "Rogue (Arcane Trickster)" {
		class = "Wizard"
	}
	// form query
	query := "SELECT name FROM spells WHERE (classes @> ARRAY[$1])"
	// search db with constructed query
	rows, err := db.Query(query, class)
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
