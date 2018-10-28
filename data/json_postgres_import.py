import psycopg2
import json
import getpass


def insert_row(cur, item, table_name, keys):
    keys = list(item.keys())
    cur.execute(f'INSERT INTO {table_name} ({", ".join([key.replace(" ", "") for key in keys])}) VALUES ({", ".join(["%s"]*len(keys))})', [item[key] for key in keys])


def upload_file(filename, key, table):
    with open(filename) as f:
        content = json.loads(f.read())

    keys = {i for j in content[key] for i in j.keys()}
    conn = psycopg2.connect(f'dbname=dnd port=5429 host=0.0.0.0 user=wizerd password={pw}')
    cur = conn.cursor()
    # cur.execute(create_table)
    for spell in content[key]:
        try:
            insert_row(cur, spell, table, keys)
        except Exception as e:
            print(e)
            raise
    conn.commit()
    cur.close()
    conn.close()


pw = getpass.getpass("Postgres Password: ")
upload_file('data/spells.json', 'Spells', 'spells')
upload_file('data/monsters.json', 'Monsters', 'monsters')
upload_file('data/reactions.json', 'reactions', 'reactions')
upload_file('data/actions.json', 'actions', 'actions')
upload_file('data/legendary_actions.json', 'legendary_actions', 'legendary_actions')
upload_file('data/special_abilities.json', 'special_abilities', 'special_abilities')
pw = ""
