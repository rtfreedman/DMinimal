import json

with open("data.json") as f:
	data = json.load(f)
keys = {i for j in data["Spells"] for i in j.keys()}
for d in data["Spells"]:
	for k in keys:
		if k not in d:
			d[k] = ""

with open("data.json", "w") as f:
	json.dump(data, f)