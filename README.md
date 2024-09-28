# Karst Geology Viewer

See [karstology.crawfordstewardship.org/about](http://karstology.crawfordstewardship.org/about) to learn more about this project.

The most comprehensive description of the tech stack can currently be found in [this pull request](https://github.com/legiongis/karstography/pull/29).

This project was developed by [Crawford Stewardship Project](http://crawfordstewardship.org) and [Legion GIS](https://legiongis.com). Much credit is due to the open source software components that make it work:

- [Postgres](https://www.postgresql.org/)/[PostGIS](https://postgis.net/)
- [GDAL](https://gdal.org/)
- [Django](https://www.djangoproject.com/)
- [pg_tileserv](https://github.com/CrunchyData/pg_tileserv)
- [OpenLayers](https://openlayers.org)
- [ol-mapbox-style](https://github.com/openlayers/ol-mapbox-style)
- [SvelteKit](https://kit.svelte.dev/)

## Install

You can set up a local development version of this web application with these steps. This guide works for Ubuntu/Debian Linux.

### System dependencies

```
sudo apt install python3-venv libgdal-dev nodejs npm
```

We also recommend [Docker](https://docs.docker.com/engine/install/debian/) for running Postgres/PostGIS, though there are other ways you can install that.

### App installation

Get the repo:

```
git clone https://github.com/legiongis/karstography && cd karstography
```

Create and activate virtual environment (there are other ways to do this too, like with Conda)

```
python3 -m venv env && source ./env/bin/activate
```

Install the Python dependencies:

```
pip install -r requirements.txt
```

### Create database

Create a new postgres user and database:

```
psql -U postgres
> CREATE USER karstographer WITH ENCRYPTED PASSWORD 'karstographer_pw';
> ALTER ROLE karstographer WITH SUPERUSER;
> CREATE DATABASE karstography WITH OWNER karstographer;
```

Create a new file `karstography/settings_local.py` and put the following database settings into it (make sure this matches the db name, user, and password you created above):

```
from .settings import DATABASES

DEBUG = TRUE

## local db settings
DATABASES['default']['NAME'] = 'karstography'
DATABASES['default']['USER'] = 'karstographer'
DATABASES['default']['PASSWORD'] = 'karstographer_pw'
```

Run the database initialization command:

```
python manage.py setup_db
```

You should now be able to run the Django dev server without error:

```
python manage.py runserver
```

### Build frontend

In a new terminal/console, enter the frontend directory and install the javascript requirements:

```
cd frontend
npm install
```

For a development build of the frontend (will reload every time you change a file), run

```
npm run dev
```

With the Django dev server running from the above step, you should now be able to open the web app in a browser at `localhost:8000`.

### Pg_tileserv

The database holds geospatial data, like sink locations, that needs to be served to the map. We use [pg_tileserv](https://access.crunchydata.com/documentation/pg_tileserv/1.0.11/introduction/) for this.

### Documentation

The `/docs` directory holds the static content generator for all of that pages under /about. These docs were created using [django-docs](https://django-docs.readthedocs.io/en/latest/) and [Sphinx](https://www.sphinx-doc.org/en/master/).

The theme used is [romnnn_sphinx_press_theme](https://github.com/romnnn/sphinx_press_theme) (with custom CSS to match the main site) and the parser is [recommonmark](https://recommonmark.readthedocs.io/en/latest/) to support Markdown.

To regenerate docs after a modification, use:

```
cd docs
make html
```
