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
    
        shp = os.path.join(settings.BASE_DIR,'cspkarst','fixtures','sinks_2.0.shp')
        
        print "loading stairs into database from file:"
        print shp

        sf = shapefile.Reader(shp)
        recs = sf.shapeRecords()
        
        field_map = {
            'sink_id':5,
            'dem_check':1,
            'img_check':2,
            'evidence':3,
            'comment':4,
            'elevation':9,
            'depth':10,
            'in_row':11,
            'in_nfhl':12,
            'hs':13,
            'aerial':14,
            'usgs':16,
            'tpi':17,
            'con':18,
            'type':15
        }
    
        ct,bad_ct = 0,0
        for rec in recs:
            r = rec.record
            s = rec.shape

            x = s.points[0][0]
            y = s.points[0][1]
            
            wkt = "POINT ({} {})".format(x,y)
            
            

            obj = Sink(
                sink_id = r[field_map['sink_id']],
                dem_check = r[field_map['dem_check']],
                img_check = r[field_map['img_check']],
                evidence = r[field_map['evidence']],
                comment = r[field_map['comment']],
                elevation = r[field_map['elevation']],
                depth = r[field_map['depth']],
                in_row = r[field_map['in_row']],
                in_nfhl = r[field_map['in_nfhl']],
                bm_hs = r[field_map['hs']],
                bm_aerial = r[field_map['aerial']],
                bm_usgs = r[field_map['usgs']],
                bm_tpi = r[field_map['tpi']],
                confidence = r[field_map['con']],
                sink_type = r[field_map['type']],
                geom=wkt)

            obj.save()
            ct += 1

        print ct, "sinks loaded"
        print bad_ct, "loading errors"
        
    def remove_sinks(self):
        
        print "removing all existing sinks in database"
        Sink.objects.all().delete()