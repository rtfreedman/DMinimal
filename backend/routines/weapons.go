package routines

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/lib/pq"
)

// Weapon represents a single weapon
type Weapon struct {
	Name            string                 `json:"name"`
	Type            string                 `json:"type"`
	Proficiency     string                 `json:"proficiency"`
	DamageType      string                 `json:"damageType"`
	Damage          string                 `json:"damage"`
	Rarity          string                 `json:"rarity"`
	Weight          float64                `json:"weight,omitempty"`
	SecondaryDamage string                 `json:"secondaryDamage,omitempty"`
	Save            string                 `json:"save,omitempty"`
	Range           []int64                `json:"range,omitempty"`
	Properties      map[string]interface{} `json:"properties,omitempty"`
	Modifiers       []string               `json:"modifiers,omitempty"`
	Description     string                 `json:"description,omitempty"`
	propertiesRaw   []byte
	rangeRaw        []sql.NullInt64
}

func (w *Weapon) clean() (err error) {
	// fix int array
	for _, value := range w.rangeRaw {
		if value.Valid {
			w.Range = append(w.Range, value.Int64)
		}
	}

	// unmarshal jsonb field
	err = json.Unmarshal(w.propertiesRaw, &w.Properties)

	return
}

// GetWeaponInfo gets the information for a single weapon
func GetWeaponInfo(weaponName string) (w *Weapon, err error) {
	fields := []string{"name", "weapon_type", "proficiency", "damage", "secondary_damage", "damage_type", "save", "range", "rarity", "properties", "modifiers", "weight", "description"}
	w = &Weapon{}
	query := fmt.Sprintf("SELECT %s FROM weapons WHERE lower(name) = lower($1)", strings.Join(fields, ","))
	rows, err := db.Query(query, weaponName)
	if err != nil {
		return
	}
	defer rows.Close()
	for rows.Next() {
		rows.Scan(&w.Name, &w.Type, &w.Proficiency, &w.Damage, &w.SecondaryDamage, &w.DamageType, &w.Save, pq.Array(&w.rangeRaw), &w.Rarity, &w.propertiesRaw, &w.Modifiers, &w.Weight, &w.Description)
	}

	// clean up
	err = w.clean()

	return
}

// GetWeapons gets an array of weapons based on optional parameters
func GetWeapons() (weapons []*Weapon, err error) {
	fields := []string{"name", "weapon_type", "proficiency", "damage", "secondary_damage", "damage_type", "save", "range", "rarity", "properties", "modifiers", "weight", "description"}
	query := fmt.Sprintf("SELECT %s FROM weapons", strings.Join(fields, ","))
	fmt.Println(query)
	rows, err := db.Query(query)
	if err != nil {
		return
	}
	defer rows.Close()
	for rows.Next() {
		// create the new wespon, scan into it and cleanup
		w := &Weapon{}
		rows.Scan(&w.Name, &w.Type, &w.Proficiency, &w.Damage, &w.SecondaryDamage, &w.DamageType, &w.Save, pq.Array(&w.rangeRaw), &w.Rarity, &w.propertiesRaw, &w.Modifiers, &w.Weight, &w.Description)
		w.clean()
		weapons = append(weapons, w)
	}

	return
}
