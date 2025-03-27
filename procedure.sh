#!/bin/bash

# wget https://database.lichess.org/lichess_db_puzzle.csv.zst
# zstd -d lichess_db_puzzle.csv.zst

DB_NAME="puzzfinder.db"
SCHEMA_FILE="sql/schema.sql"
IMPORT_FILE="sql/import_data.sql"

echo "Starting database setup"
echo "Creating schema..."

sqlite3 $DB_NAME < $SCHEMA_FILE

echo "Importing data... (this might take a while)"
time sqlite3 $DB_NAME < $IMPORT_FILE

echo -e "\nDatabase setup completed"

# real    4m27.689s
# user    3m49.763s
# sys     0m37.507s
