#!/bin/bash

# https://database.lichess.org/#puzzles

# wget https://database.lichess.org/lichess_db_puzzle.csv.zst

mongoimport --db puzzfinder --collection puzzles --type csv --headerline \
	--file <(zstdcat lichess_db_puzzle.csv.zst | sed '1s/PuzzleId/_id/')
