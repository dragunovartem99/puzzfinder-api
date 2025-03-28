#!/bin/bash

#wget https://database.lichess.org/lichess_db_puzzle.csv.zst
#zstd -d lichess_db_puzzle.csv.zst

DB_NAME="puzzfinder.db"
SCHEMA_FILE="sql/schema.sql"
IMPORT_FILE="sql/import_data.sql"
INDEXES_FILE="sql/indexes.sql"

echo "Starting database setup"
echo "Creating schema..."

sqlite3 $DB_NAME < $SCHEMA_FILE

echo "Importing data... (this will take a while)"
time sqlite3 $DB_NAME < $IMPORT_FILE

# CPU: AMD Ryzen 7 5700U with Radeon Graphics (16) @ 1.800GHz
# real    3m53.243s
# user    3m43.581s
# sys     0m9.263s

echo -e "\nCreating indexes"
time sqlite3 $DB_NAME < $INDEXES_FILE

echo -e "\nDatabase setup completed"
