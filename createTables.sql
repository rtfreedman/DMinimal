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
drop table if exists armor cascade;
drop table if exists adventuring_gear cascade;
drop table if exists equipment_packs cascade;
drop table if exists equipment_pack_items cascade;

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
	damage_dice_type integer NOT NULL,
	damage_dice_count integer NOT NULL,
	secondary_damage_dice_type integer,
	secondary_damage_dice_count integer,
	damage_type text DEFAULT 'No Damage',
	save text,
	range integer[],
	rarity text DEFAULT 'Standard',
	properties jsonb,
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