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
	fmt.Print("Mongo Password: ")
	bytePassword, err := terminal.ReadPassword(int(syscall.Stdin))
	if err != nil {
		log.Fatal("Error getting mongo terminal password")
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
	monsterLock.Lock()
	defer monsterLock.Unlock()
	for cursor.Next(ctx) {
		var tmpMonster Monster
		if err := cursor.Decode(&tmpMonster); err != nil {
			log.Fatal(err.Error())
		}
		cachedMonsterList = append(cachedMonsterList, tmpMonster.Name)
	}
}
