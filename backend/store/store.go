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
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()
	fmt.Println("Initiating mongo driver...")
	var err error
	db, err = configDB(ctx, false, "", "127.0.0.1", "27041", "dnddb")
	if err != nil {
		log.Fatal(err.Error())
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
	filter := bson.NewDocument(bson.EC.String("name", name))
	result := spellsDB.FindOne(nil, filter)
	err = result.Decode(&spell)
	return
}

// GetSpellsByClass returns a spell from the db searching by class
func GetSpellsByClass(class string) (spells []Spell, err error) {
	spellsDB := db.Collection("spells")
	// filter
	filter := bson.NewDocument(bson.EC.String("classes", class))
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

// Actions of a monster
type Actions struct {
}

// Reactions of a monster
type Reactions struct {
}

// SpecialAbilities of a monster
type SpecialAbilities struct {
}

// LegendaryActions of a monster
type LegendaryActions struct {
}

// Monster represents a monster object from the DB
type Monster struct {
	Reactions             []Reactions        `json:"reactions,omitempty"`
	WIS                   int                `json:"WIS,omitempty"`
	INT                   int                `json:"INT,omitempty"`
	LegendaryActions      []LegendaryActions `json:"legendaryActions,omitempty"`
	ArmorClass            int                `json:"armorClass,omitempty"`
	SpecialAbilities      []SpecialAbilities `json:"specialAbilities,omitempty"`
	Languages             string             `json:"languages,omitempty"`
	Actions               []Actions          `json:"actions,omitempty"`
	STR                   int                `json:"STR,omitempty"`
	HitPoints             int                `json:"hitPoints,omitempty"`
	DamageResistances     string             `json:"damageResistances,omitempty"`
	DEX                   int                `json:"DEX,omitempty"`
	CHR                   int                `json:"CHR,omitempty"`
	TypeString            string             `json:"type,omitempty"`
	Perception            int                `json:"perception,omitempty"`
	Subtype               string             `json:"subtype,omitempty"`
	DamageVulnerabilities string             `json:"damageVulnerabilities,omitempty"`
	HitDice               string             `json:"hitDice,omitempty"`
	Name                  string             `json:"name,omitempty"`
	Alignment             string             `json:"alignment,omitempty"`
	Skills                string             `json:"skills,omitempty"`
	ConditionImmunities   string             `json:"conditionImmunities,omitempty"`
	CON                   int                `json:"CON,omitempty"`
	ChallengeRating       int                `json:"challengeRating,omitempty"`
	DamageImmunities      string             `json:"damageImmunities,omitempty"`
	Size                  string             `json:"size,omitempty"`
	Senses                string             `json:"senses,omitempty"`
	SavingThrows          string             `json:"savingThrows,omitempty"`
	Speed                 string             `json:"speed,omitempty"`
}

// GetMonsters returns a list of monster names
func GetMonsters() (monsterNames []string) {
	// TODO
	return
}

// GetMonster returns a monster object by name name
func GetMonster(name string) (monster Monster) {
	// TODO
	return
}
