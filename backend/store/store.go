package store

import (
	"context"
	"fmt"
	"log"
	"syscall"

	"github.com/mongodb/mongo-go-driver/bson"
	"github.com/mongodb/mongo-go-driver/mongo"
	"golang.org/x/crypto/ssh/terminal"
)

var db *mongo.Database
var cachedMonsterList []string

func getPassword() string {
	fmt.Print("Postgres Password: ")
	bytePassword, err := terminal.ReadPassword(int(syscall.Stdin))
	if err != nil {
		log.Fatal("Error getting postgres terminal password")
	}
	password := string(bytePassword)
	return password
}

func configDB(ctx context.Context, hasAuth bool, userName string, host string, port string, dbName string) (db *mongo.Database, err error) {
	var uri string
	if hasAuth {
		uri = fmt.Sprintf("mongodb://%s:%s@%s:%s", userName, getPassword(), host, port)
	} else {
		uri = fmt.Sprintf("mongodb://%s:%s", host, port)
	}
	client, err := mongo.NewClient(uri)
	if err != nil {
		return
	}
	err = client.Connect(ctx)
	db = client.Database(dbName)
	return
}

func init() {
	ctx := context.Background()
	fmt.Println("Initiating mongo driver...")
	var err error
	db, err = configDB(ctx, false, "", "127.0.0.1", "27041", "dnddb")
	if err != nil {
		log.Fatal(err.Error())
	}
	monstersDB := db.Collection("monsters")
	filter := bson.M{}
	cursor, err := monstersDB.Find(ctx, filter)
	if err != nil {
		log.Fatal(err.Error())
	}
	for cursor.Next(ctx) {
		var tmpMonster Monster
		if err := cursor.Decode(&tmpMonster); err != nil {
			log.Fatal(err.Error())
		}
		cachedMonsterList = append(cachedMonsterList, tmpMonster.Name)
	}
}

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
func GetSpellsByClass(class string) (spells []Spell, err error) {
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
		spells = append(spells, spell)
	}
	return
}

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

// UpdateMonsterList updates the cached monster list from the db
func UpdateMonsterList() (err error) {
	ctx := context.Background()
	monstersDB := db.Collection("monsters")
	filter := bson.M{}
	cursor, err := monstersDB.Find(ctx, filter)
	if err != nil {
		return
	}
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
