package routines

import (
	"database/sql"

	// required for postgres driver not sure if i need it here and spell.go
	_ "github.com/lib/pq"
)

// GetMonsters get monster list
func GetMonsters() (ret []string, err error) {
	rows, err := db.Query("SELECT monster FROM monsters")
	if err != nil {
		return
	}
	defer rows.Close()
	for rows.Next() {
		var name sql.NullString
		err = rows.Scan(&name)
		if err != nil {
			continue
		}
		if name.Valid {
			ret = append(ret, name.String)
		}
	}
	return
}

// GetMonsterInfo returns all info about monster
func GetMonsterInfo(monster string) (val map[string]interface{}, err error) {
	val = map[string]interface{}{}
	mi, err := getMonsterTableInfo(monster)
	if err != nil {
		return
	}
	addMonsterInfoToMap(mi, val)
	oi, err := getMonsterOtherTableInfo(monster, false, "reactions")
	if err == nil {
		for i := range oi {
			addOtherInfoToMap("Reactions", oi[i], val)
		}
	}
	oi, err = getMonsterOtherTableInfo(monster, false, "legendary_actions")
	if err == nil {
		for i := range oi {
			addOtherInfoToMap("Legendary Actions", oi[i], val)
		}
	}
	oi, err = getMonsterOtherTableInfo(monster, false, "special_abilities")
	if err == nil {
		for i := range oi {
			addOtherInfoToMap("Special Abilities", oi[i], val)
		}
	}
	oi, err = getMonsterOtherTableInfo(monster, true, "actions")
	if err == nil {
		for i := range oi {
			addOtherInfoToMap("Actions", oi[i], val)
		}
	}
	reshapeMonster(val)
	return
}

func reshapeMonster(monster map[string]interface{}) {
	scores := []string{"CHR", "CON", "DEX", "INT", "STR", "WIS"}
	abilityScores := map[string]interface{}{}
	for _, score := range scores {
		if _, ok := monster[score]; ok {
			abilityScores[score] = monster[score]
			delete(monster, score)
		}
	}
	for k, v := range monster {
		if v == "" {
			delete(monster, k)
		}
	}
	monster["Ability Scores"] = abilityScores
}

type monsterInfo struct {
	CHR                   sql.NullInt64
	CON                   sql.NullInt64
	DEX                   sql.NullInt64
	INT                   sql.NullInt64
	STR                   sql.NullInt64
	WIS                   sql.NullInt64
	armorClass            sql.NullInt64
	hitPoints             sql.NullInt64
	perception            sql.NullInt64
	challengeRating       sql.NullFloat64
	alignment             sql.NullString
	conditionImmunities   sql.NullString
	damageImmunities      sql.NullString
	damageResistances     sql.NullString
	damageVulnerabilities sql.NullString
	hitDice               sql.NullString
	languages             sql.NullString
	monster               sql.NullString
	senses                sql.NullString
	size                  sql.NullString
	speed                 sql.NullString
	subtype               sql.NullString
	typeString            sql.NullString
	savingThrows          sql.NullString
	skills                sql.NullString
}

type otherInfo struct {
	damageBonus sql.NullInt64
	damageDice  sql.NullString
	description sql.NullString
	monster     sql.NullString
	name        sql.NullString
}

func getMonsterTableInfo(monsterName string) (mi monsterInfo, err error) {
	row := db.QueryRow("SELECT CHR, CON, DEX, INT, STR, WIS, armor_class, hit_points, perception, challenge_rating, alignment, condition_immunities, damage_immunities, damage_resistances, damage_vulnerabilities, hit_dice, languages, monster, senses, size, speed, subtype, type, saving_throws, skills from monsters WHERE monster=$1", monsterName)
	err = row.Scan(&mi.CHR, &mi.CON, &mi.DEX, &mi.INT, &mi.STR, &mi.WIS, &mi.armorClass, &mi.hitPoints, &mi.perception, &mi.challengeRating, &mi.alignment, &mi.conditionImmunities, &mi.damageImmunities, &mi.damageResistances, &mi.damageVulnerabilities, &mi.hitDice, &mi.languages, &mi.monster, &mi.senses, &mi.size, &mi.speed, &mi.subtype, &mi.typeString, &mi.savingThrows, &mi.skills)
	return
}

// ew...
func addMonsterInfoToMap(mi monsterInfo, val map[string]interface{}) {
	if mi.CHR.Valid {
		val["CHR"] = mi.CHR.Int64
	}
	if mi.CON.Valid {
		val["CON"] = mi.CON.Int64
	}
	if mi.DEX.Valid {
		val["DEX"] = mi.DEX.Int64
	}
	if mi.INT.Valid {
		val["INT"] = mi.INT.Int64
	}
	if mi.STR.Valid {
		val["STR"] = mi.STR.Int64
	}
	if mi.WIS.Valid {
		val["WIS"] = mi.WIS.Int64
	}
	if mi.armorClass.Valid {
		val["Armor Class"] = mi.armorClass.Int64
	}
	if mi.hitPoints.Valid {
		val["Hitpoints"] = mi.hitPoints.Int64
	}
	if mi.perception.Valid {
		val["Perception"] = mi.perception.Int64
	}
	if mi.challengeRating.Valid {
		val["Challenge Rating"] = mi.challengeRating.Float64
	}
	if mi.alignment.Valid {
		val["Alignment"] = mi.alignment.String
	}
	if mi.conditionImmunities.Valid {
		val["Condition Immunities"] = mi.conditionImmunities.String
	}
	if mi.damageImmunities.Valid {
		val["Damage Immunities"] = mi.damageImmunities.String
	}
	if mi.damageResistances.Valid {
		val["Damage Resistances"] = mi.damageResistances.String
	}
	if mi.damageVulnerabilities.Valid {
		val["Damage Vulnerabilities"] = mi.damageVulnerabilities.String
	}
	if mi.hitDice.Valid {
		val["Hit Dice"] = mi.hitDice.String
	}
	if mi.languages.Valid {
		val["Languages"] = mi.languages.String
	}
	if mi.monster.Valid {
		val["Monster"] = mi.monster.String
	}
	if mi.senses.Valid {
		val["Senses"] = mi.senses.String
	}
	if mi.size.Valid {
		val["Size"] = mi.size.String
	}
	if mi.speed.Valid {
		val["Speed"] = mi.speed.String
	}
	if mi.subtype.Valid {
		val["Subtype"] = mi.subtype.String
	}
	if mi.typeString.Valid {
		val["Type"] = mi.typeString.String
	}
	if mi.savingThrows.Valid {
		val["Saving Throws"] = mi.savingThrows.String
	}
	if mi.skills.Valid {
		val["Skills"] = mi.skills.String
	}
}

// I can't bother to come up with a better name
func getMonsterOtherTableInfo(monsterName string, isAction bool, tableName string) (oi []otherInfo, err error) {
	// since I'm always supplying table name I don't need to worry about sql injection
	queryString := "SELECT description, name FROM " + tableName + " WHERE monster=$1"
	if isAction {
		queryString = "SELECT damage_bonus, damage_dice, description, name FROM " + tableName + " WHERE monster=$1"
	}
	var rows *sql.Rows
	rows, err = db.Query(queryString, monsterName)
	if err != nil {
		return
	}
	for rows.Next() {
		var oiItem otherInfo
		if isAction {
			err = rows.Scan(&oiItem.damageBonus, &oiItem.damageDice, &oiItem.description, &oiItem.name)
		} else {
			err = rows.Scan(&oiItem.description, &oiItem.name)
		}
		oi = append(oi, oiItem)
	}
	return
}

func addOtherInfoToMap(key string, oi otherInfo, val map[string]interface{}) {
	newMap := map[string]interface{}{}
	if oi.damageBonus.Valid {
		newMap["Damage Bonus"] = oi.damageBonus.Int64
	}
	if oi.damageDice.Valid {
		newMap["Damage Dice"] = oi.damageDice.String
	}
	if oi.description.Valid {
		newMap["Description"] = oi.description.String
	}
	if oi.monster.Valid {
		newMap["Monster"] = oi.monster.String
	}
	if oi.name.Valid {
		newMap["Name"] = oi.name.String
	}
	if _, ok := val[key]; !ok {
		val[key] = []map[string]interface{}{}
	}
	val[key] = append(val[key].([]map[string]interface{}), newMap)
}
