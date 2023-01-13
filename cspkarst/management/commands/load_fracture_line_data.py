import csv
from django.core.management.base import BaseCommand, CommandError
from cspkarst.models import FractureLine

class Command(BaseCommand):
    help = 'load fracture line CSV populate database.'

    def add_arguments(self, parser):
        parser.add_argument(
            'file',
            help='path to CSV with WKT definitions of fracture lines',
        )
        parser.add_argument(
            '-f',
            '--flush',
            action='store_true',
            dest='flush',
            default=False,
            help='delete all existing loading',
        )

    def handle(self, *args, **options):

        if options['flush']:
            self.remove_sinks()
        self.load_fracture_lines(options['file'])

    def load_fracture_lines(self, file_path):

        with open(file_path, "r") as f:
            reader = csv.reader(f)
            # skip over the header
            next(reader)
            for row in reader:
                wkt = row[0]
                FractureLine.objects.create(geom=wkt)


    def remove_fracture_lines(self):

        print("removing all existing fracture lines in database")
        FractureLine.objects.all().delete()
