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
			addOtherInfoToMap("reactions", oi[i], val)
		}
	}
	oi, err = getMonsterOtherTableInfo(monster, false, "legendary_actions")
	if err == nil {
		for i := range oi {
			addOtherInfoToMap("legendary_actions", oi[i], val)
		}
	}
	oi, err = getMonsterOtherTableInfo(monster, false, "special_abilities")
	if err == nil {
		for i := range oi {
			addOtherInfoToMap("special_abilities", oi[i], val)
		}
	}
	oi, err = getMonsterOtherTableInfo(monster, true, "actions")
	if err == nil {
		for i := range oi {
			addOtherInfoToMap("actions", oi[i], val)
		}
	}
	return
}

type monsterInfo struct {
	CHR                   sql.NullInt64
	CON                   sql.NullInt64
	DEX                   sql.NullInt64
	INT                   sql.NullInt64
	STR                   sql.NullInt64
	WIS                   sql.NullInt64
	armorClass            sql.NullInt64
	history               sql.NullInt64
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
}

type otherInfo struct {
	damageBonus sql.NullInt64
	damageDice  sql.NullString
	description sql.NullString
	monster     sql.NullString
	name        sql.NullString
}

func getMonsterTableInfo(monsterName string) (mi monsterInfo, err error) {
	row := db.QueryRow("SELECT CHR, CON, DEX, INT, STR, WIS, armor_class, history, hit_points, perception, challenge_rating, alignment, condition_immunities, damage_immunities, damage_resistances, damage_vulnerabilities, hit_dice, languages, monster, senses, size, speed, subtype, type from monsters WHERE monster=$1", monsterName)
	err = row.Scan(&mi.CHR, &mi.CON, &mi.DEX, &mi.INT, &mi.STR, &mi.WIS, &mi.armorClass, &mi.history, &mi.hitPoints, &mi.perception, &mi.challengeRating, &mi.alignment, &mi.conditionImmunities, &mi.damageImmunities, &mi.damageResistances, &mi.damageVulnerabilities, &mi.hitDice, &mi.languages, &mi.monster, &mi.senses, &mi.size, &mi.speed, &mi.subtype, &mi.typeString)
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
		val["armorClass"] = mi.armorClass.Int64
	}
	if mi.history.Valid {
		val["history"] = mi.history.Int64
	}
	if mi.hitPoints.Valid {
		val["hitPoints"] = mi.hitPoints.Int64
	}
	if mi.perception.Valid {
		val["perception"] = mi.perception.Int64
	}
	if mi.challengeRating.Valid {
		val["challengeRating"] = mi.challengeRating.Float64
	}
	if mi.alignment.Valid {
		val["alignment"] = mi.alignment.String
	}
	if mi.conditionImmunities.Valid {
		val["conditionImmunities"] = mi.conditionImmunities.String
	}
	if mi.damageImmunities.Valid {
		val["damageImmunities"] = mi.damageImmunities.String
	}
	if mi.damageResistances.Valid {
		val["damageResistances"] = mi.damageResistances.String
	}
	if mi.damageVulnerabilities.Valid {
		val["damageVulnerabilities"] = mi.damageVulnerabilities.String
	}
	if mi.hitDice.Valid {
		val["hitDice"] = mi.hitDice.String
	}
	if mi.languages.Valid {
		val["languages"] = mi.languages.String
	}
	if mi.monster.Valid {
		val["monster"] = mi.monster.String
	}
	if mi.senses.Valid {
		val["senses"] = mi.senses.String
	}
	if mi.size.Valid {
		val["size"] = mi.size.String
	}
	if mi.speed.Valid {
		val["speed"] = mi.speed.String
	}
	if mi.subtype.Valid {
		val["subtype"] = mi.subtype.String
	}
	if mi.typeString.Valid {
		val["typeString"] = mi.typeString.String
	}
}

// I can't bother to come up with a better name
func getMonsterOtherTableInfo(monsterName string, isAction bool, tableName string) (oi []otherInfo, err error) {
	// since I'm always supplying table name I don't need to worry about sql injection
	queryString := "SELECT description, monster, name FROM " + tableName + " WHERE monster=$1"
	if isAction {
		queryString = "SELECT damage_bonus, damage_dice, description, monster, name FROM " + tableName + " WHERE monster=$1"
	}
	var rows *sql.Rows
	rows, err = db.Query(queryString, monsterName)
	if err != nil {
		return
	}
	for rows.Next() {
		var oiItem otherInfo
		if isAction {
			err = rows.Scan(&oiItem.damageBonus, &oiItem.damageDice, &oiItem.description, &oiItem.monster, &oiItem.name)
		} else {
			err = rows.Scan(&oiItem.description, &oiItem.monster, &oiItem.name)
		}
		oi = append(oi, oiItem)
	}
	return
}

func addOtherInfoToMap(key string, oi otherInfo, val map[string]interface{}) {
	newMap := map[string]interface{}{}
	if oi.damageBonus.Valid {
		newMap["damageBonus"] = oi.damageBonus.Int64
	}
	if oi.damageDice.Valid {
		newMap["damageDice"] = oi.damageDice.String
	}
	if oi.description.Valid {
		newMap["description"] = oi.description.String
	}
	if oi.monster.Valid {
		newMap["monster"] = oi.monster.String
	}
	if oi.name.Valid {
		newMap["name"] = oi.name.String
	}
	if _, ok := val[key]; !ok {
		val[key] = []map[string]interface{}{}
	}
	val[key] = append(val[key].([]map[string]interface{}), newMap)
}
