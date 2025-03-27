#!/bin/bash

sqlite3 puzzfinder.db < sql/schema.sql
sqlite3 puzzfinder.db < sql/import_data.sql
