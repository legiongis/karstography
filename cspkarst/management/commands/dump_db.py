from django.core import management
from django.core.management.base import BaseCommand, CommandError

class Command(BaseCommand):
    help = 'dumps all of the ORM contents to predefined fixture files.'

    def add_arguments(self, parser):
        parser.add_argument(
            '-y',
            '--yes',
            action='store_true',
            dest='yes',
            default=False,
            help='forces the continuation of any command that has a confirmation prompt',
        )

    def handle(self, *args, **options):

        force = options['yes']
        self.dump_db(force)

    def dump_db(self,force=False):

        print("dumping the database")
        if not force:
            c = input("  -- this will overwrite the existing fixture files. continue? y/n >> ")
            if not c.lower().startswith("y"):
                print("     command cancelled.")
                return

        ## this will need to be revisited when additional counties are added
        ## because ALL sinks are currently dumped into a single file, and
        ## splitting them may be helpful.
        management.call_command('dumpdata', 'cspkarst.TownUnit',
            indent=1, output="cspkarst/fixtures/TownUnit.json")
        management.call_command('dumpdata', 'cspkarst.Sink',
            indent=1, output="cspkarst/fixtures/Sinks_CrawfordCo.json")
        management.call_command('dumpdata', 'cspkarst.PointOfInterest',
            indent=1, output="cspkarst/fixtures/PointOfInterest.json")

        print("done")
