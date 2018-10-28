package routines

import "database/sql"

// GetMonsters get monster list
func GetMonsters() (ret []string, err error) {
	rows, err := db.Query("SELECT name FROM monsters")
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
