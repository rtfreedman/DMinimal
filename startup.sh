echo "Hopefully you changed the Postgres password in docker-compose file.." # change the password in the docker file
echo "Starting docker container..."
docker-compose up -d
echo "Sleeping to let container finish startup tasks before accessing..."
sleep 60
echo "Creating postgres tables..."
psql -U wizerd -h 0.0.0.0 -p 5429 -d dnd -f createTables.sql # going to require a password
echo "Ingesting dnd data..."
python3 data/json_postgres_import.py