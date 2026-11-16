# /usr/bin/bash

cd frontend
npm ci
npm run build

cd ../docs
rm _build/html -r
make html

cd ..
uv run manage.py collectstatic --noinput

touch karstography/wsgi.py
