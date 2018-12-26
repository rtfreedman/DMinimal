package store

import (
	"context"
	"sync"

	"github.com/mongodb/mongo-go-driver/bson"
)

// if you access the cachedMonsterList you need to RLock/RUnlock on read and Lock/Unlock on writes
var cachedMonsterList []string
var monsterLock = sync.RWMutex{}

// AlternateAction represents the actions, reactions, specialabilities, or legendaryactions of a monster
type AlternateAction struct {
	AttackBonus string `json:"attackBonus,omitempty"`
	DamageDice  string `json:"damageDice,omitempty"`
	DamageBonus string `json:"damageBonus,omitempty"`
	Name        string `json:"name,omitempty"`
	Description string `json:"description,omitempty"`
}

// Monster represents a monster object from the DB
type Monster struct {
	Reactions             []AlternateAction `json:"reactions,omitempty"`
	WIS                   int               `json:"WIS,omitempty"`
	INT                   int               `json:"INT,omitempty"`
	LegendaryActions      []AlternateAction `json:"legendaryActions,omitempty"`
	ArmorClass            int               `json:"armorClass,omitempty"`
	SpecialAbilities      []AlternateAction `json:"specialAbilities,omitempty"`
	Languages             string            `json:"languages,omitempty"`
	Actions               []AlternateAction `json:"actions,omitempty"`
	STR                   int               `json:"STR,omitempty"`
	HitPoints             int               `json:"hitPoints,omitempty"`
	DamageResistances     string            `json:"damageResistances,omitempty"`
	DEX                   int               `json:"DEX,omitempty"`
	CHR                   int               `json:"CHR,omitempty"`
	TypeString            string            `json:"type,omitempty"`
	Perception            int               `json:"perception,omitempty"`
	Subtype               string            `json:"subtype,omitempty"`
	DamageVulnerabilities string            `json:"damageVulnerabilities,omitempty"`
	HitDice               string            `json:"hitDice,omitempty"`
	Name                  string            `json:"name,omitempty"`
	Alignment             string            `json:"alignment,omitempty"`
	Skills                string            `json:"skills,omitempty"`
	ConditionImmunities   string            `json:"conditionImmunities,omitempty"`
	CON                   int               `json:"CON,omitempty"`
	ChallengeRating       int               `json:"challengeRating,omitempty"`
	DamageImmunities      string            `json:"damageImmunities,omitempty"`
	Size                  string            `json:"size,omitempty"`
	Senses                string            `json:"senses,omitempty"`
	SavingThrows          string            `json:"savingThrows,omitempty"`
	Speed                 string            `json:"speed,omitempty"`
}

// UpdateMonsterList updates the cached monster list from the db (admin only)
func UpdateMonsterList() (err error) {
	ctx := context.Background()
	monstersDB := db.Collection("monsters")
	filter := bson.M{}
	cursor, err := monstersDB.Find(ctx, filter)
	if err != nil {
		return
	}
	monsterLock.Lock()
	monsterLock.Unlock()
	for cursor.Next(ctx) {
		var tmpMonster Monster
		if err = cursor.Decode(&tmpMonster); err != nil {
			return
		}
		cachedMonsterList = append(cachedMonsterList, tmpMonster.Name)
	}
	return
}

// GetMonsters returns a list of monster names
func GetMonsters() []string {
	monsterLock.RLock()
	defer monsterLock.RUnlock()
	return cachedMonsterList
}

// GetMonster returns a monster object by name name
func GetMonster(name string) (monster Monster, err error) {
	monstersDB := db.Collection("monsters")
	// filter
	filter := bson.M{"name": name}
	result := monstersDB.FindOne(nil, filter)
	err = result.Decode(&monster)
	return
}
