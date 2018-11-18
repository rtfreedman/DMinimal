import json
import getpass
import psycopg2
import re

# load json data in
with open("data/item_data.json", "r") as f:
    data = json.load(f)

with open("data/weapon_properties.json", "r") as f:
    properties = json.load(f)


def json_to_sql(name, content):
    """Fixes json keys for postgres ingest"""
    sql_dict = {"name": name}
    for key, value in content.items():
        # fix tabs in the data
        value = value.replace("\t", ". ")

        # not a switch statement
        if key == "range":
            sql_dict[key] = [int(r) for r in value.split("/")]
        elif key == "modifiers":
            sql_dict[key] = value.split(", ")
        elif key == "properties":
            sql_dict[key] = json.dumps({p: properties[p] for p in value.split(", ")})
        elif key == "weight":
            sql_dict[key] = float(value)
        elif key == "item_rarity":
            sql_dict["rarity"] = value
        elif key == "item_type":
            sql_dict["weapon_type"] = value
        elif key == "subtype":
            sql_dict["proficiency"] = value.split(",")[0]
        elif key in ["category"]:
            continue
        else:
            sql_dict[key] = value

    # handle the net
    if "damage" not in content:
        sql_dict["damage"] = "0d0"

    return sql_dict


# postgres connection
pw = getpass.getpass("Postgres Password: ")
conn = psycopg2.connect(f'dbname=dnd port=5429 host=0.0.0.0 user=wizerd password={pw}')
cursor = conn.cursor()

# find the weapons with + modifiers
# they have incomplete data so we find them and recreate them using the full weapon data
weapons_with_modifiers = set()
regex = re.compile(r"([\w\s]+)\s{1}\+\d{1}")
for group, items in data.items():
    for item, content in items.items():
        if content.get("item_type") and "Weapon" in content["item_type"]:
            matched = regex.match(item)
            if matched:
                weapons_with_modifiers.add(matched.group(1))

# insert weapons
for group, items in data.items():
    if group.startswith("Martial") or group.startswith("Simple"):
        for item, content in items.items():
            sql_data = json_to_sql(item, content)
            fields = ",".join(sql_data.keys())
            cursor.execute(f"INSERT INTO weapons ({fields}) VALUES ({','.join(['%s'] * len(sql_data.keys()))})", (*sql_data.values(),))
            
            # Add the modified versions of items if they exist
            if item in weapons_with_modifiers:
                weapon_type = content["item_type"].split()[0]
                existing_modifiers = sql_data.get("modifiers") or []
                for n in range(1, 4):
                    sql_data["name"] = item + f" +{n}"
                    sql_data["modifiers"] = existing_modifiers + [f"{weapon_type} Attacks +{n}", f"{weapon_type} Damage +{n}"]
                    fields = ",".join(sql_data.keys())
                    cursor.execute(f"INSERT INTO weapons ({fields}) VALUES ({','.join(['%s'] * len(sql_data.keys()))})", (*sql_data.values(),))

conn.commit()
conn.close()
