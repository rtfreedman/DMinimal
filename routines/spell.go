package routines

import "sort"

type empty struct{}

var tiers = map[string]float64{
	"Bard": 1.0, "Cleric": 1.0, "Sorcerer": 1.0,
	"Wizard": 1.0, "Druid": 1.0, "Paladin": 0.5, "Ranger": 0.5,
	"Fighter (Eldritch Knight)": 0.333, "Rogue (Arcane Trickster)": 0.333,
}

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
