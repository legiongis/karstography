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
            '--shp',
            help='path to hydrologic unit shapefile',
        )
        parser.add_argument(
            '--url',
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

        sources = {
            "HUC12": {
                "url":  "https://csp.us-southeast-1.linodeobjects.com/hydrology/hydrologic_units_WBDHU12_wi_3184089_07.zip",
                "file": "wbdhu12_a_wi.shp"
            },
            "HUC10": {
                "url":  "https://csp.us-southeast-1.linodeobjects.com/hydrology/hydrologic_units_WBDHU10_wi_3184089_06.zip",
                "file": "wbdhu10_a_wi.shp"
            },
            "HUC8": {
                "url":  "https://csp.us-southeast-1.linodeobjects.com/hydrology/hydrologic_units_WBDHU8_wi_3184089_05.zip",
                "file": "wbdhu8_a_wi.shp"
            },
        }

        for k, v in sources.items():
            ds = DataSource(f"/vsizip//vsicurl/{v['url']}/{v['file']}")
            lyr = ds[0]
            # lyr = self.get_lyr_from_shp(options['shp'])
        # lyr = self.get_lyr_from_url(options['url'])

        # print("loading hydrologic units...")
        # if "HUC8" in lyr.fields:
        #     huc_field = "HUC8"
        # elif "HUC10" in lyr.fields:
        #     huc_field = "HUC10"
        # elif "HUC12" in lyr.fields:
        #     huc_field = "HUC12"
        # else:
        #     print("No HUC field found. Cancelling load.")
        #     exit()

            ct = 0
            for feat in lyr:
                huc = feat.get(k)
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

    def get_lyr_from_url(self, file_path):
        ds = DataSource(file_path)
        lyr = ds[0]
        return lyr


