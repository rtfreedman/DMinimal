CREATE TABLE spells (
  id SERIAL PRIMARY KEY,
  range TEXT,
  school TEXT,
  classes TEXT[],
  castingtime TEXT,
  athigherlevels TEXT,
  level INTEGER,
  components TEXT, 
  duration TEXT,
  name TEXT,
  concentration TEXT,
  description TEXT,
  source TEXT
);

CREATE TABLE users (
  userid SERIAL PRIMARY KEY,
  username TEXT,
  credentialinfo TEXT
);

CREATE TABLE userinfo (
  id SERIAL PRIMARY KEY,
  userid INTEGER,
  savedContent TEXT,
  contentType TEXT
);