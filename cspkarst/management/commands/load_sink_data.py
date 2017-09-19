from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
import os
import shapefile
# import pygeoif
from cspkarst.models import Sink

class Command(BaseCommand):
    help = 'load sink shapefile to populate database.'

    def add_arguments(self, parser):
        parser.add_argument(
            '-f',
            '--flush',
            action='store_true',
            dest='flush',
            default=False,
            help='delete all existing sinks before loading process',
        )

    def handle(self, *args, **options):

        if options['flush']:
            self.remove_sinks()
        self.load_sinks()

    def load_sinks(self):
    
        shp = os.path.join(settings.BASE_DIR,'cspkarst','fixtures','sinks_initial.shp')
        
        print "loading stairs into database from file:"
        print shp

        sf = shapefile.Reader(shp)
        recs = sf.shapeRecords()
    
        ct,bad_ct = 0,0
        for rec in recs:
            r = rec.record
            s = rec.shape

            sink_id = r[5]
            dem_check = r[1]
            img_check = r[2]
            evidence = r[3].strip()
            comment = r[4].strip()
            elevation = r[9]
            depth = r[10]
            in_row = r[11]
            in_nfhl = r[12]
            
            x = s.points[0][0]
            y = s.points[0][1]
            
            wkt = "POINT ({} {})".format(x,y)

            
            obj = Sink(
                sink_id = sink_id,
                dem_check = dem_check,
                img_check = img_check,
                evidence = evidence,
                comment = comment,
                elevation = elevation,
                depth = depth,
                in_row = in_row,
                in_nfhl = in_nfhl,
                geom=wkt)

            obj.save()
            ct += 1

        print ct, "sinks loaded"
        print bad_ct, "loading errors"
        
    def remove_sinks(self):
        
        print "removing all existing sinks in database"
        Sink.objects.all().delete()