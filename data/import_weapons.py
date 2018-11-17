import json
import getpass
import psycopg2

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

# insert weapons
for group, items in data.items():
    if group.startswith("Martial") or group.startswith("Simple"):
        for item, content in items.items():
            sql_data = json_to_sql(item, content)
            fields = ",".join(sql_data.keys())
            cursor.execute(f"INSERT INTO weapons ({fields}) VALUES ({','.join(['%s'] * len(sql_data.keys()))})", (*sql_data.values(),))
conn.commit()
conn.close()
