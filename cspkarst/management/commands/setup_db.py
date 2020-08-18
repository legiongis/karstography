from django.core import management
from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
from django.conf import settings
import psycopg2 as db
import os


class Command(BaseCommand):
    help = 'drops and recreates the app database.'

    def add_arguments(self, parser):
        parser.add_argument(
            '-y',
            '--yes',
            action='store_true',
            dest='yes',
            default=False,
            help='forces the continuation of any command that has a confirmation prompt',
        )
        pass

    def handle(self, *args, **options):

        force = options['yes']
        self.setup_db(force)


    def setup_db(self,force=False):

        print("setting up the database")
        if not force:
            c = input("  -- this will erase the entire database. continue? y/n >> ")
            if not c.lower().startswith("y"):
                print("     command cancelled.")
                return

        dbinfo = settings.DATABASES['default']

        # Postgres version
        conn = db.connect(host=dbinfo['HOST'], user=dbinfo['USER'],
                        password=dbinfo['PASSWORD'], port=int(dbinfo['PORT']))
        conn.autocommit = True
        cursor = conn.cursor()
        try:
            cursor.execute("DROP DATABASE " + dbinfo['NAME'])
        except Exception as e:
            raise e
        cursor.execute("CREATE DATABASE " + dbinfo['NAME'] + " WITH ENCODING 'UTF8'")

        management.call_command('makemigrations')
        management.call_command('migrate')
        management.call_command('loaddata', 'TownUnit')
        management.call_command('loaddata', 'Sinks_CrawfordCo')
        management.call_command('loaddata', 'PointOfInterest')

        print("making admin...")

        default_user = User.objects.create_user('admin','','cspmaster')
        default_user.is_staff = True
        default_user.is_superuser = True
        default_user.save()


        print("admin superuser created. password = cspmaster.")



        print("done")
