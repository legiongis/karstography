# /usr/bin/bash

cd frontend
rm node_modules -r
npm install
npm run build

cd ../docs
rm _build/html -r
make html

cd ..
uv run manage.py collectstatic --noinput

touch karstography/wsgi.py
