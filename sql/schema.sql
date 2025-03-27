-- Main puzzles table
CREATE TABLE puzzles (
    id TEXT PRIMARY KEY,
    fen TEXT NOT NULL,
    moves TEXT NOT NULL,
    rating INTEGER NOT NULL,
    ratingDeviation INTEGER NOT NULL,
    popularity INTEGER NOT NULL,
    nbPlays INTEGER NOT NULL,
    gameUrl TEXT NOT NULL,
    openingTags TEXT
);

-- Themes lookup table
CREATE TABLE themes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

-- Puzzle-theme relationship table
CREATE TABLE puzzle_themes (
    puzzle_id TEXT NOT NULL,
    theme_id INTEGER NOT NULL,
    PRIMARY KEY (puzzle_id, theme_id),
    FOREIGN KEY (puzzle_id) REFERENCES puzzles(id),
    FOREIGN KEY (theme_id) REFERENCES themes(id)
);

-- Indexes
CREATE INDEX idx_puzzles_rating ON puzzles(rating);
CREATE INDEX idx_puzzles_popularity ON puzzles(popularity);
CREATE INDEX idx_puzzles_nbPlays ON puzzles(nbPlays);
CREATE INDEX idx_themes_name ON themes(name);
