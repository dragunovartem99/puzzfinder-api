-- Raw representation of CSV contents
CREATE TEMPORARY TABLE temp_puzzles (
    id TEXT,
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
.import --skip 1 lichess_db_puzzle.csv temp_puzzles

-- Populate puzzles table (with no themes)
INSERT INTO puzzles (id, fen, moves, rating, ratingDeviation, popularity, nbPlays, gameUrl, openingTags)
SELECT id, fen, moves, rating, ratingDeviation, popularity, nbPlays, gameUrl, openingTags
FROM temp_puzzles;

-- Process themes
WITH split(word, str) AS (
    SELECT '', themes||' ' FROM temp_puzzles
    UNION ALL
    SELECT
        substr(str, 0, instr(str, ' ')),
        substr(str, instr(str, ' ')+1)
    FROM split WHERE str!=''
)
INSERT OR IGNORE INTO themes (name)
SELECT DISTINCT trim(word) 
FROM split 
WHERE word!='';

-- Create puzzle-theme relationships
INSERT INTO puzzle_themes (puzzle_id, theme_id)
SELECT tp.id, t.id
FROM temp_puzzles tp
JOIN themes t ON ' ' || tp.themes || ' ' LIKE '% ' || t.name || ' %';

-- Cleanup
DROP TABLE temp_puzzles;
