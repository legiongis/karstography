"""
Django settings for karstography project.

Generated by 'django-admin startproject' using Django 1.11.

For more information on this file, see
https://docs.djangoproject.com/en/1.11/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.11/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DOCS_ROOT = os.path.join(BASE_DIR, 'docs/_build/html')

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.11/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'XXXXXXXXXXXXXX'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = []

# Application definition

INSTALLED_APPS = [
    'django.contrib.gis',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'leaflet',
    'cspkarst',
    'docs',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'karstography.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'cspkarst.context_processors.context',
                'cspkarst.context_processors.sink_counts',
            ],
        },
    },
]

WSGI_APPLICATION = 'karstography.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.11/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'karstography',
        'USER': 'xxxxxxxxxx',
        'PASSWORD': 'xxxxxxxxxxxxx',
        'HOST': '127.0.0.1',
        'PORT': '5432',
        'POSTGIS_TEMPLATE': 'XXX-XX-XXXX',
    }
}


# Password validation
# https://docs.djangoproject.com/en/1.11/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/1.11/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'America/Chicago'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.11/howto/static-files/

STATIC_URL = '/static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "cspkarst", "static"),
]

LEAFLET_CONFIG = {
    'DEFAULT_CENTER': (22.28,114.15),
    'DEFAULT_ZOOM': 14,
    'MIN_ZOOM': 13,
    'MAX_ZOOM': 19,
    'SPATIAL_EXTENT': (114, 22.2, 114.25, 22.35),
    'SCALE': None,
    'TILES': [],
    'MINIMAP': False,
    'PLUGINS': {
        'fullscreen': {
            'css': ['https://api.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v1.0.1/leaflet.fullscreen.css'],
            'js': 'https://api.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v1.0.1/Leaflet.fullscreen.min.js',
            'auto-include': True,
        },
        'markercluster': {
            'css': ['https://unpkg.com/leaflet.markercluster@1.0.3/dist/MarkerCluster.Default.css','https://unpkg.com/leaflet.markercluster@1.0.3/dist/MarkerCluster.css'],
            'js': 'https://unpkg.com/leaflet.markercluster@1.0.3/dist/leaflet.markercluster.js',
            'auto-include': True,
        },
        # 'minimap': {
            # 'css': [STATIC_URL + 'plugins/minimap/Control.MiniMap.min.css'],
            # 'js': STATIC_URL + 'plugins/minimap/Control.MiniMap.min.js',
            # 'auto-include': True,
        # },
        'leaflet-gps': {
            'css': [STATIC_URL + 'plugins/leaflet-gps/leaflet-gps.min.css'],
            'js': STATIC_URL + 'plugins/leaflet-gps/leaflet-gps.min.js',
            'auto-include': True,
        },
        'leaflet-hash': {
            'css': [],
            'js': STATIC_URL + 'plugins/leaflet-hash.js',
            'auto-include': True,
        },
    }
}

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

ROOT_URL = ''

# must be either 'production' or 'staging'
ENVIRONMENT = 'production'

try:
    from .settings_local import *
except ImportError:
    pass
