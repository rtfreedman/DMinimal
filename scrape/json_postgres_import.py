import psycopg2
import json

# generate type string for expected input values in set
def get_type_string(content):
	# where we'll store our keyname : type string pairs
	keys = {}
	for spell in content['Spells']:
		spell_keys = set(spell.keys())
		# if it's worth looking iterating here
		if len(set(keys.keys()).union(spell_keys)) > len(keys):
			for key in spell_keys:
				# if we haven't seen this key before
				if key not in keys:
					t = type(spell[key])
					if t is str:
						keys[key] = 'varchar'
					elif t is int:
						keys[key] = 'integer'
					elif t is list:
						keys[key] = 'varchar[]'
					elif t is bool:
						keys[key] = 'boolean'
	# string construction
	return ', '.join([k.replace(' ','') + ' ' + v for k,v in keys.items()])

def insert_spell(cur, spell):
	spell_keys = list(spell.keys())
	# because you can't have backslashes in fstring brackets
	def quote(item):
		if type(item) is str:
			return '\"' + item + '\"'
		elif type(item) is list:
			return 'ARRAY' + str(item)
		return str(item)
	cur.execute(f'INSERT INTO spells ({", ".join([key.replace(" ", "") for key in spell_keys])}) VALUES ({", ".join(["%s"]*len(spell_keys))})', [spell[key] for key in spell_keys])

with open('data.json', 'r') as f:
	content = json.loads(f.read())

keys = set()
for spell in content['Spells']:
	keys = keys.union(set(spell.keys()))
# Key: Level, Type: <class 'int'>
# Key: Name, Type: <class 'str'>
# Key: Duration, Type: <class 'str'>
# Key: Range, Type: <class 'str'>
# Key: School, Type: <class 'str'>
# Key: Description, Type: <class 'str'>
# Key: Components, Type: <class 'str'>
# Key: Classes, Type: <class 'list'>

create_table = f'CREATE TABLE spells (id serial PRIMARY KEY, {get_type_string(content)});'
# print('\n')
# print(create_table)
# print('\n\n')
# print()
# print('\n')
# exit()
conn = psycopg2.connect('dbname=dnd user=ryan')
cur = conn.cursor()
cur.execute(create_table)
for spell in content['Spells']:
	try:
		insert_spell(cur, spell)
	except Exception as e:
		print(e)
		raise
conn.commit()
cur.close()
conn.close()








