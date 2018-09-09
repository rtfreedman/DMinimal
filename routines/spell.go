package routines

type empty struct{}

var tiers = map[string]float64{
	"Bard": 1.0, "Cleric": 1.0, "Sorcerer": 1.0,
	"Wizard": 1.0, "Druid": 1.0, "Paladin": 0.5, "Ranger": 0.5,
	"Fighter (Eldritch Knight)": 0.333, "Rogue (Arcane Trickster)": 0.333,
}

var slots = map[int][]int{
	1:  []int{2},
	2:  []int{3},
	3:  []int{4, 2},
	4:  []int{4, 3},
	5:  []int{4, 3, 2},
	6:  []int{4, 3, 3},
	7:  []int{4, 3, 3, 1},
	8:  []int{4, 3, 3, 2},
	9:  []int{4, 3, 3, 3, 1},
	10: []int{4, 3, 3, 3, 2},
	11: []int{4, 3, 3, 3, 2, 1},
	12: []int{4, 3, 3, 3, 2, 1},
	13: []int{4, 3, 3, 3, 2, 1, 1},
	14: []int{4, 3, 3, 3, 2, 1, 1},
	15: []int{4, 3, 3, 3, 2, 1, 1, 1},
	16: []int{4, 3, 3, 3, 2, 1, 1, 1},
	17: []int{4, 3, 3, 3, 2, 1, 1, 1, 1},
	18: []int{4, 3, 3, 3, 3, 1, 1, 1, 1},
	19: []int{4, 3, 3, 3, 3, 2, 1, 1, 1},
	20: []int{4, 3, 3, 3, 3, 2, 2, 1, 1},
}

// Class is a representation of the class of a character with level and classname populated
type Class struct {
	Level     int
	ClassName string
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
		spellSlots[i] = int(tiers[c.ClassName] * float64(spellSlots[i]))
	}
	return spellSlots
}

// GetClassNames returns all classes that can use magic
func GetClassNames() []string {
	var classes []string
	for key := range tiers {
		classes = append(classes, key)
	}
	return classes
}
