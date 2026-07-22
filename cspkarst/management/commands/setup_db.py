from django.core import management
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


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

        print("setting up the database")

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
