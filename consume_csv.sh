#!/bin/bash

# https://database.lichess.org/#puzzles

mongoimport --db puzzfinder --collection puzzles --type csv --headerline \
	--file <(zstdcat lichess_db_puzzle.csv.zst | sed '1s/PuzzleId/_id/')
