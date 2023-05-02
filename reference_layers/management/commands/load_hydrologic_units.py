from datetime import datetime
from pathlib import Path
from django.contrib.gis.geos import GEOSGeometry, MultiPolygon
from django.contrib.gis.gdal import DataSource
from django.core.management.base import BaseCommand, CommandError
from reference_layers.models import HydrologicUnit

class Command(BaseCommand):
    help = 'load fracture line CSV populate database.'

    def add_arguments(self, parser):
        parser.add_argument(
            'shp',
            help='path to hydrologic unit shapefile',
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
            HydrologicUnit.objects.all().delete()

        lyr = self.get_lyr_from_shp(options['shp'])

        print("loading hydrologic units...")
        if "HUC8" in lyr.fields:
            huc_field = "HUC8"
        elif "HUC10" in lyr.fields:
            huc_field = "HUC10"
        elif "HUC12" in lyr.fields:
            huc_field = "HUC12"
        else:
            print("No HUC field found. Cancelling load.")
            exit()

        ct = 0
        for feat in lyr:
            huc = feat.get(huc_field)
            geom = self.ensure_multipolygon(feat.geom, lyr.srs.srid)
            geom.transform(4326)
            name = feat.get("NAME")
            obj, created = HydrologicUnit.objects.get_or_create(huc=huc)
            obj.name = name
            obj.geom = geom
            obj.save()
            ct += 1

        print(f"  {ct} saved.")

    def ensure_multipolygon(self, geom, srid):
        """ Ensures that the input geom is converted from Polygon to
        MultiPolygon, if necessary. Also, set the SRID on the geometry
        so it can be properly transformed later, if necessary."""
        geom = GEOSGeometry(geom.wkt)
        if geom.geom_type == "Polygon":
            geom = MultiPolygon([geom])
        geom.srid = srid
        return geom

    def get_lyr_from_shp(self, file_path):
        ds = DataSource(file_path)
        lyr = ds[0]
        return lyr


