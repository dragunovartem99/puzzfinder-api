#!/bin/bash

# https://database.lichess.org/#puzzles
# wget https://database.lichess.org/lichess_db_puzzle.csv.zst

# Check if input file is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 input.csv"
    exit 1
fi

INPUT_CSV=$1
DB_NAME="puzzfinder.db"
TABLE_NAME="puzzles"

# Remove existing database file if it exists
rm -f "$DB_NAME"

SQL_COMMANDS=$(cat <<EOF
CREATE TABLE $TABLE_NAME (
    puzzleId TEXT PRIMARY KEY,
    fen TEXT,
    moves TEXT,
    rating INTEGER,
    ratingDeviation INTEGER,
    popularity INTEGER,
    nbPlays INTEGER,
    themes TEXT,
    gameUrl TEXT,
    openingTags TEXT
);

.mode csv
.import '$INPUT_CSV' $TABLE_NAME

-- Remove header row if it was imported
DELETE FROM $TABLE_NAME WHERE puzzleId = 'PuzzleId';

CREATE INDEX idx_rating ON $TABLE_NAME(rating);
EOF
)

echo "$SQL_COMMANDS" | sqlite3 "$DB_NAME"
echo "Conversion complete. Database created: $DB_NAME"
