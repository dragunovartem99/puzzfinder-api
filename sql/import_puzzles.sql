-- sqlite3 puzzfinder.db < import_puzzles.sql

-- Create the table
CREATE TABLE puzzles (
    id TEXT PRIMARY KEY,
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
.import lichess_db_puzzle.csv puzzles

DELETE FROM puzzles WHERE id = 'PuzzleId';

-- Indexes
CREATE INDEX idx_rating ON puzzles(rating);

SELECT "Import completed! " || COUNT(*) || " puzzles loaded." FROM puzzles;
