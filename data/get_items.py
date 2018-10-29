import requests
import json
from collections import defaultdict
from bs4 import BeautifulSoup

item_list_url = ""
single_item_url = ""
# column names
column_names = [i.lower().replace(" ", "_") for i in ["Item Type","Subtype","AC","Category","Damage","Damage Type","Duration","Item Rarity","Modifiers","Properties","Range","Requires Attunement","Save","Secondary Damage","Stealth","Target","Weight","data-Bundle"]]

# get item list and parse
resp = requests.get(item_list_url)
out = json.loads(resp.json()["results"])
total = len(out)
items = defaultdict(dict)

# loop and parse item data
# items are sorted by the "Subtype" field, item["c"][1]
# match to columns names and make a second request for extra description data
for i, item in enumerate(out):
    # initial item data mapping
    group = item["c"][1] if item["c"][1] != "\u2014" else item["c"][0]
    # print(item["n"], ",",  item["c"][0], ",", item["c"][1], ",", group, ",", item["c"][1] != "-")
    items[group][item["n"]] = {k: v for k, v in dict(zip(column_names, item["c"])).items() if v != "—" and k not in ["Category", "Subtype"]}
    
    # attempt to get any specials or descriptions
    resp = requests.get(single_item_url.format(item["n"]))
    s = BeautifulSoup(resp.content, "html.parser")
    if s.select_one("div#pagecontent").text:
        items[group][item["n"]]["description"] = s.select_one("div#pagecontent").text.strip().replace("\n", " ")

    #  progress printout
    print("", f"{i}/{total}", end="\r")

# get all the unique fields for sql file construction
item_group_fields = defaultdict(set)
for group in items:
    for item in items[group]:
        for field in items[group][item]:
            item_group_fields[group].add(field)

# turn back into lists so it can be serialized
for group, field in item_group_fields.items():
    item_group_fields[group] = list(field)

# write the files
with open("item_fields.json", "w") as f:
    json.dump(item_group_fields, f, indent=True)

with open("item_data.json", "w") as f:
    json.dump(items, f, indent=True)
