import json

with open("item_data.json", "r") as f:
    data = json.load(f)

weapons = ["Ammunition", "Martial, Axe", "Melee Weapon", "Martial, Blowgun", "Ranged Weapon", "Simple", "Simple, Dagger", "Sword", "Martial, Flail", "Martial, Glaive", "Simple, Club", "Martial, Sword", "Martial, Halberd", "Martial, Maul, Hammer", "Martial, Crossbow", "Simple, Axe", "Simple, Javelin", "Martial, Lance", "Simple, Crossbow", "Simple, Hammer", "Martial, Bow", "Simple, Mace", "Martial, Maul", "Martial, Morningstar", "Martial, Net", "Martial, Pike", "Simple, Staff", "Simple, Bow", "Simple, Sickle", "Simple, Sling", "Simple, Spear", "Sword, Martial", "Martial, Trident", "Trident,Martial", "Martial, Pick", "Martial, Hammer", "Martial, Whip"]

for group, items in data.items():
    print(group)
    if group in weapons:
        for item, content in items.items():
            content["name"] = item
            print(f'INSERT INTO weapons ({", ".join([key.replace(" ", "") for key in content])}) VALUES ({", ".join(["%s"]*len(content))})', [content[key] for key in content])