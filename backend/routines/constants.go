package routines

import (
	"database/sql"
	"fmt"
	"log"
	"syscall"

	"golang.org/x/crypto/ssh/terminal"
)

var db *sql.DB

// Setup sets up the db connection object
func init() {
	password := getPassword()
	connStr := fmt.Sprintf("user=wizerd dbname=dnd host=0.0.0.0 port=5429 password=%s sslmode=disable", password)
	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Could not connect to Postgres DB : " + err.Error())
	}
	// so that "API running on port X is not in the same line the password acceptor was"
	fmt.Println("")
}

func getPassword() string {
	fmt.Print("Postgres Password: ")
	bytePassword, err := terminal.ReadPassword(int(syscall.Stdin))
	if err != nil {
		log.Fatal("Error getting postgres terminal password")
	}
	password := string(bytePassword)
	return password
}
