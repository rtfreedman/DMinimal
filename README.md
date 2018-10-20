# DMinimal
Dnd 5e unit/character tracker for Dungeon Masters of DnD 5th edition.

## Stack
- VueJS frontend
- Golang API
- Postgres Containerized Database
- Python3 utility scripts

## Postgres database layout
User info:
Users' passwords are not stored in the database. Uniquely salted hashes are put in the credentialInfo column.
### users
|         userid     |  username  | credentialinfo |
|:------------------:|:----------:|:--------------:|
| serial primary key |    text    |      text      |
|          0         | rtfreedman | 6DA1D16...5421 |
### userinfo
|         id         | userid  | savedContent | contentType |
|:------------------:|:-------:|:------------:|:-----------:|
| serial primary key | integer |      text    |    text     |

Topic Specific information
### spells
|         id         | range | school | classes | castingtime | athigherlevels |  level  | components | duration | name | concentration | description | source |
|:------------------:|:-----:|:------:|:-------:|:-----------:|:--------------:|:-------:|:----------:|:--------:|:----:|:-------------:|:-----------:|:------:|
| primary key serial |  text |  text  |   text  |     text    |      text      | integer |    text    |   text   | text |      text     |     text    |  text  |

### monsters
TODO


