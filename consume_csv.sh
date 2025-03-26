#!/bin/bash

# https://database.lichess.org/#puzzles
# wget https://database.lichess.org/lichess_db_puzzle.csv.zst

mongosh puzzfinder --eval "db.puzzles.drop()"
mongoimport \
	--db puzzfinder \
	--collection puzzles \
	--type csv \
	--file <(zstdcat lichess_db_puzzle.csv.zst | sed '1s/PuzzleId/_id/') \
	--headerline \
	--mode=upsert
