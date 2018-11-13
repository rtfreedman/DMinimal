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
	history integer,
	hit_dice varchar,
	hit_points integer,
	languages varchar,
	monster varchar,
	perception integer,
	senses varchar,
	size varchar,
	speed varchar,
	subtype varchar,
	type varchar
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
	damage_dice_type integer NOT NULL,
	damage_dice_count integer NOT NULL,
	secondary_damage_dice_type integer,
	secondary_damage_dice_count integer,
	damage_type text NOT NULL,
	range integer[],
	rarity text NOT NULL,
	properties text[],
	modifiers text[],
	weight float,
	description text
);
CREATE TABLE armor (
	id serial PRIMARY KEY,
	name text NOT NULL,
	ac integer NOT NULL,
	stealth text,
	weight float NOT NULL,
	description text	
);
CREATE TABLE adventuring_gear (
	id serial PRIMARY KEY,
	name text NOT NULL,
	weight float,
	save text,
	target text,
	duration text,
	range integer[],
	damage_type text,
	damage_dice_type integer,
	damage_dice_count integer,
	rarity text,
	subtype text,
	properties text[],
	description text
);
CREATE TABLE equipment_packs (
	id serial PRIMARY KEY,
	name text,
	rarity text,
	description text
);
CREATE TABLE equipment_pack_items (
	id serial PRIMARY KEY,
	equipment_pack_id integer REFERENCES equipment_packs,
	adventuring_gear_id integer REFERENCES adventuring_gear,
	count integer
);