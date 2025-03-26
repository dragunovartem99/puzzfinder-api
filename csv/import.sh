#!/bin/bash

# https://database.lichess.org/#puzzles
# wget https://database.lichess.org/lichess_db_puzzle.csv.zst

mongosh puzzfinder --eval "db.puzzles.drop()"

mongoimport \
  --type csv \
  --file <(zstdcat lichess_db_puzzle.csv.zst | tail -n +2) \
  --db puzzfinder \
  --collection puzzles \
  --columnsHaveTypes \
  --fieldFile fields.txt
