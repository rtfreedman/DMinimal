from pymongo import MongoClient
from bson import json_util
# import getpass

mongodb = MongoClient("mongodb://127.0.0.1:27041")
# mongodb = MongoClient("mongodb://wizerd:{}@127.0.0.1:27041".format(getpass.getpass(prompt="Mongo Password: ")))


def import_mongo_data(db, filename):
    with open(filename) as f:
        content = json_util.loads(f.read())
    if type(content) is not dict or len(content.keys()) == 0:
        raise Exception("Content error: json data must be shaped like : {'collectionname':[documents...], 'othercollectionname': [otherdocuments...], ...}")
    for key in content.keys():
        if type(content[key]) is not list:
            raise Exception("Content error: json data must be shaped like : {'collectionname':[documents...]}")
    for collection_name in content.keys():
        collection_name = list(content.keys())[0]
        collection = db[collection_name]
        documents = content[collection_name]
        collection.insert_many(documents)


dnd = mongodb.dnddb
import_mongo_data(dnd, 'mongo_data/monsters.json')
import_mongo_data(dnd, 'mongo_data/items.json')
import_mongo_data(dnd, 'mongo_data/spells.json')
