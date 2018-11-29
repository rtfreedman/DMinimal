echo "Hopefully you changed the Postgres password in docker-compose file.." # change the password in the docker file
echo "Starting docker containers..."
# untar mongodb data (should only be done during a build)
tar xf mongodb/data.tar.xz -C mongodb/
docker-compose up -d --build
echo "Waiting to let container finish startup tasks before accessing..."
OUTPUT=""; 
while [ `echo $OUTPUT | grep -c accepting` = 0 ]; do 
  OUTPUT=`docker exec -it ashardalon pg_isready`;
  sleep 1 
done
echo "Creating postgres tables..."
psql -U wizerd -h 0.0.0.0 -p 5429 -d dnd -f createTables.sql # going to require a password
echo "Ingesting dnd data..."
python3 data/json_postgres_import.py
python3 data/import_weapons.py
