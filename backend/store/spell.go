package store

import (
	"context"
	"errors"
	"math"
	"sort"
	"strconv"
	"sync"

	"github.com/mongodb/mongo-go-driver/bson"
)

// if you access the cachedSpellOpts you need to RLock/RUnlock on read and Lock/Unlock on writes
var cachedSpellOpts = map[string][]map[string]string{}
var spellLock = sync.RWMutex{}

// Spell represents a spell object from the db
type Spell struct {
	AtHigherLevels string   `json:"atHigherLevels,omitempty"`
	CastingTime    string   `json:"castingTime,omitempty"`
	Classes        []string `json:"classes,omitempty"`
	Components     string   `json:"components,omitempty"`
	Concentration  bool     `json:"concentration,omitempty"`
	Description    string   `json:"description,omitempty"`
	Duration       string   `json:"duration,omitempty"`
	Level          int      `json:"level,omitempty"`
	Name           string   `json:"name,omitempty"`
	Range          string   `json:"range,omitempty"`
	School         string   `json:"school,omitempty"`
}

// GetSpellByName returns a spell from the db searching by name
func GetSpellByName(name string) (spell Spell, err error) {
	spellsDB := db.Collection("spells")
	// filter
	filter := bson.M{"name": name}
	result := spellsDB.FindOne(nil, filter)
	err = result.Decode(&spell)
	return
}

// GetSpellsByClass returns a spell from the db searching by class
func GetSpellsByClass(class string) (spells []map[string]string, err error) {
	if _, ok := tiers[class]; !ok {
		return nil, errors.New("Non-magical class submitted to SpellList API endpoint")
	}
	if class == "Fighter (Eldritch Knight)" || class == "Rogue (Arcane Trickster)" {
		class = "Wizard"
	}
	spellLock.RLock()
	if opts, ok := cachedSpellOpts[class]; ok {
		spellLock.RUnlock()
		return opts, nil
	}
	spellLock.RUnlock()
	spellsDB := db.Collection("spells")
	// filter
	filter := bson.M{"classes": class}
	cursor, err := spellsDB.Find(nil, filter)
	if err != nil {
		return
	}
	for cursor.Next(context.Background()) {
		var spell Spell
		err = cursor.Decode(&spell)
		if err != nil {
			// TODO: handle
		}
		spells = append(spells, map[string]string{
			"name":  spell.Name,
			"level": strconv.Itoa(spell.Level),
		})
	}
	spellLock.Lock()
	defer spellLock.Unlock()
	cachedSpellOpts[class] = spells
	return
}

// ResetClassSpellListCache is an admin-only function that resets the class spell list cache
func ResetClassSpellListCache() {
	spellLock.Lock()
	defer spellLock.Unlock()
	cachedSpellOpts = map[string][]map[string]string{}
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

// Class is a representation of the class of a character with level and classname populated
type Class struct {
	Level     int    `json:"level"`
	ClassName string `json:"class"`
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

var tiers = map[string]float64{
	"Bard": 1.0, "Cleric": 1.0, "Sorcerer": 1.0,
	"Wizard": 1.0, "Druid": 1.0, "Paladin": 0.5, "Ranger": 0.5,
	"Fighter (Eldritch Knight)": 0.333, "Rogue (Arcane Trickster)": 0.333,
	"Warlock": 0.1,
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
