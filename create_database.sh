#!/bin/bash

#wget https://database.lichess.org/lichess_db_puzzle.csv.zst
#zstd -d lichess_db_puzzle.csv.zst

source bash/themes
source bash/generate_schema

INPUT_CSV="lichess_db_puzzle.csv"
DB_FILE="puzzfinder.db"
SCHEMA_FILE="sql/schema.sql"
INDEXES_FILE="sql/indexes.sql"

# Generate the schema with theme columns
generate_schema $SCHEMA_FILE

# Create database and schema
sqlite3 $DB_FILE < $SCHEMA_FILE

# Generate the SQL for importing data with theme columns
IMPORT_SQL="INSERT INTO puzzles SELECT 
    id,
    fen,
    moves,
    (LENGTH(moves) - LENGTH(REPLACE(moves, ' ', '')) + 1) / 2 AS movesNumber,
    rating,
    ratingDeviation,
    popularity,
    nbPlays,
    gameUrl,
    openingTags,"

for theme in "${THEMES[@]}"; do
    IMPORT_SQL+="
    CASE WHEN themes LIKE '%${theme}%' THEN 1 ELSE 0 END AS theme_${theme},"
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

# Apply indexes after import is complete
echo "Creating indexes..."
sqlite3 "$DB_FILE" < "$INDEXES_FILE"

echo "Import completed. Database file: $DB_FILE"
