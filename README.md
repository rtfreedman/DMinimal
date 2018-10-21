# DMinimal
Dnd 5e unit/character tracker for Dungeon Masters of DnD 5th edition.

# Requirements
## Stack
- Frontend: Vue, Node
- Backend: Golang
- Utility scripts: Python3.6+
    - If you want to perform any scraping then Chromedriver, Selenium, and Google Chrome are necessary
- DB: Docker, Docker-Compose, and Postgres (to use psql locally to the 5429 port)

## Setup
- After installing all requirements run the `startup.sh` script to create and start the containerized postgres instance and upload all data into the container.
- 

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
| primary key serial |  text |  text  | text[]  |     text    |      text      | integer |    text    |   text   | text |      text     |     text    |  text  |

### monsters
TODO


