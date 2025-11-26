# /usr/bin/bash

source ./env/bin/activate

cd frontend
rm node_modules -r
npm install
npm run build

cd ../docs
rm _build/html -r
make html

cd ..
python manage.py collectstatic --noinput

sudo service apache2 reload
