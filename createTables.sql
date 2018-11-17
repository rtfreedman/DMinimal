-- ryan REALLY doesn't like capitalizing his SQL keywords

drop table if exists spells;
drop table if exists users;
drop table if exists userinfo;
drop table if exists monsters;
drop table if exists reactions;
drop table if exists legendary_actions;
drop table if exists special_abilities;
drop table if exists actions;
drop table if exists weapons cascade;

create table spells (id serial primary key,
	range text,
	school text,
	classes text[],
	castingtime text,
	athigherlevels text,
	level integer,
	components text,
	duration text,
	name text,
	concentration text,
	description text,
	source text
);
create table users (userid serial primary key,
	username text,
	credentialinfo text,
	sources text[]
);
create table userinfo (id serial primary key,
	userid integer,
	savedContent text,
	contentType text
);
create table monsters (CHR integer,
	CON integer,
	DEX integer,
	INT integer,
	STR integer,
	WIS integer,
	alignment varchar,
	armor_class integer,
	challenge_rating real,
	condition_immunities varchar,
	damage_immunities varchar,
	damage_resistances varchar,
	damage_vulnerabilities varchar,
	hit_dice varchar,
	hit_points integer,
	languages varchar,
	monster varchar,
	perception integer,
	senses varchar,
	size varchar,
	speed varchar,
	subtype varchar,
	type varchar,
	saving_throws varchar,
	skills varchar
);
create table reactions (attack_bonus integer,
	description varchar,
	monster varchar,
	name varchar
);
create table legendary_actions (attack_bonus integer,
	description varchar,
	monster varchar,
	name varchar
);
create table special_abilities (attack_bonus integer,
	description varchar,
	monster varchar,
	name varchar
);
create table actions (attack_bonus integer,
	damage_bonus integer,
	damage_dice varchar,
	description varchar,
	monster varchar,
	name varchar
);
CREATE TABLE weapons (
	id serial PRIMARY KEY,
	name text NOT NULL,
	weapon_type text NOT NULL,
	proficiency text NOT NULL,
	damage text NOT NULL,
	secondary_damage text DEFAULT '',
	damage_type text DEFAULT 'No Damage',
	save text DEFAULT '',
	range integer[] DEFAULT '{}'::integer[],
	rarity text DEFAULT 'Standard',
	properties jsonb DEFAULT '{}'::jsonb,
	modifiers text[] DEFAULT '{}'::text[],
	weight real DEFAULT 0.0,
	description text DEFAULT ''
);