from pymongo import MongoClient
from bson import json_util
# import getpass

# mongodb = MongoClient("mongodb://wizerd:{}@127.0.0.1:27041".format(getpass.getpass(prompt="Mongo Password: ")))
mongodb = MongoClient("mongodb://127.0.0.1:27041")
with open('mongo_data/monster_data_full.json') as f:
    content = json_util.loads(f.read())
dnd = mongodb.dnddb
monsters_collection = dnd.monsters
monsters_collection.insert_many(content["monsters"])
with open('mongo_data/item_data.json') as f:
    content = json_util.loads(f.read())
items_collection = dnd.items
items_collection.insert_many(content["items"])
