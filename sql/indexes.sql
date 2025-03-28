-- Essential indexes
CREATE INDEX idx_themes_name ON themes(name);
CREATE INDEX idx_puzzle_themes_theme_id ON puzzle_themes(theme_id);
CREATE INDEX idx_puzzles_rating ON puzzles(rating);

-- Secondary indexes
CREATE INDEX idx_puzzles_popularity ON puzzles(popularity);
CREATE INDEX idx_puzzles_nbPlays ON puzzles(nbPlays);
