#!/bin/bash

#wget https://database.lichess.org/lichess_db_puzzle.csv.zst
#zstd -d lichess_db_puzzle.csv.zst

source ./themes

INPUT_CSV="lichess_db_puzzle.csv"
DB_FILE="puzzfinder.db"
SCHEMA_FILE="sql/schema.sql"

# Generate the schema with theme columns
{
    echo "CREATE TABLE puzzles ("
    echo "    id TEXT PRIMARY KEY,"
    echo "    fen TEXT NOT NULL,"
    echo "    moves TEXT NOT NULL,"
    echo "    rating INTEGER NOT NULL,"
    echo "    ratingDeviation INTEGER NOT NULL,"
    echo "    popularity INTEGER NOT NULL,"
    echo "    nbPlays INTEGER NOT NULL,"
    echo "    gameUrl TEXT NOT NULL,"
    echo "    openingTags TEXT,"
    echo
    echo "    -- Jesus, forgive my wicked soul"

    for (( i=0; i<${#THEMES[@]}; i++)); do
        theme="${THEMES[$i]}"
        theme="${theme^}"
        if [ $i -eq $((${#THEMES[@]} - 1)) ]; then
            echo "    theme${theme} BOOLEAN NOT NULL CHECK (theme${theme} IN (0, 1))"
        else
            echo "    theme${theme} BOOLEAN NOT NULL CHECK (theme${theme} IN (0, 1)),"
        fi
    done

    echo ");"
} > "$SCHEMA_FILE"

sqlite3 $DB_FILE < $SCHEMA_FILE

# Generate the SQL for importing data with theme columns
IMPORT_SQL="INSERT INTO puzzles SELECT 
    id,
    fen,
    moves,
    rating,
    ratingDeviation,
    popularity,
    nbPlays,
    gameUrl,
    openingTags,"

for theme in "${THEMES[@]}"; do
    IMPORT_SQL+="
    CASE WHEN themes LIKE '%${theme}%' THEN 1 ELSE 0 END AS theme${theme^},"
done

# Remove trailing comma
IMPORT_SQL="${IMPORT_SQL%,} FROM temp_import;"

echo "Importing data..."
sqlite3 "$DB_FILE" <<EOF
.mode csv
.import "$INPUT_CSV" temp_import

$IMPORT_SQL

DROP TABLE temp_import;
VACUUM;
EOF

echo "Import completed. Database file: $DB_FILE"
