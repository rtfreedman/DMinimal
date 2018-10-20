# DMinimal
Dnd 5e unit/character tracker for Dungeon Masters of DnD 5th edition.

## Stack
- VueJS frontend
- Golang API
- Postgres Containerized Database
- Python3 utility scripts

## Postgres database layout
### spells
|         id         | range | school | classes | castingtime | athigherlevels |  level  | components | duration | name | concentration | description | source |
|:------------------:|:-----:|:------:|:-------:|:-----------:|:--------------:|:-------:|:----------:|:--------:|:----:|:-------------:|:-----------:|:------:|
| primary key serial |  text |  text  |   text  |     text    |      text      | integer |    text    |   text   | text |      text     |     text    |  text  |

### users
TODO

### monsters
TODO


