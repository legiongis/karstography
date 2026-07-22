#! /usr/bin/bash

psql -U postgres -h localhost -c "CREATE USER karstographer WITH ENCRYPTED PASSWORD 'karstographer_pw';"
psql -U postgres -h localhost  -c "ALTER ROLE karstographer WITH SUPERUSER;"
psql -U postgres -h localhost  -c "DROP DATABASE IF EXISTS karstography;"
psql -U postgres -h localhost  -c "CREATE DATABASE karstography WITH OWNER karstographer;"
psql -U postgres -h localhost  -d karstography -c "CREATE EXTENSION PostGIS;"