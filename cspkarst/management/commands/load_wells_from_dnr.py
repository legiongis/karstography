import os
import json
import urllib.request
from datetime import datetime
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.contrib.gis.gdal import DataSource
from cspkarst.models import TownUnit, Well


class Command(BaseCommand):
    help = 'drops and recreates the app database.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--town',
            help='forces the continuation of any command that has a confirmation prompt',
        )
        parser.add_argument(
            '--county',
            help='case-sensitive county name',
        )
        parser.add_argument(
            '--nocache',
            help='do not use any existing cache for this query',
            action="store_true",
            default=False
        )
        parser.add_argument(
            '--qry-type',
            nargs='?',
            help='do not use any existing cache for this query',
            choices=['attribute', 'geometry']
        )
        parser.add_argument(
            '--use_attribute',
            help='Query by town and county name attributes',
            action="store_true",
            default=False
        )

    def handle(self, *args, **options):

        self.verbose = options['verbosity'] > 1

        wells_data = self.get_wells_geojson(
            town=options['town'],
            county=options['county'],
            use_cache=not options['nocache'],
            by_attribute=options['qry_type'] in [None, 'attribute'],
            by_geometry=options['qry_type'] in [None, 'geometry'],
        )

        self.import_wells(wells_data)

    def get_wells_geojson(self, town, county, use_cache=True, by_attribute=True, by_geometry=True):

        main_cache = os.path.join(settings.CACHE_DIR, f"{county.upper()}_{town.upper()}.geojson")
        attribute_cache = main_cache.replace(".geojson", "-attribute_qry.geojson")
        geom_cache_file = main_cache.replace(".geojson", "-geom_qry.geojson")

        well_features = []

        if by_geometry:
            print("retrieving wells based on town boundary...")
            if use_cache and os.path.isfile(geom_cache_file):
                print("  using cached spatial query results")
                with open(geom_cache_file, "r") as op:
                    geojson_response = json.loads(op.read())
            else:
                print("  running geometry query")
                geojson_response = self.query_dnr_by_town_shape(town)
                with open(geom_cache_file, "w") as op:
                    json.dump(geojson_response, op)
            well_features += geojson_response['features']
            print(f"  result count: {len(geojson_response['features'])}")

        if by_attribute:
            if use_cache and os.path.isfile(attribute_cache):
                print("  using cached attribute query results")
                with open(attribute_cache, "r") as op:
                    geojson_response = json.loads(op.read())
            else:
                print("  running attribute query")
                geojson_response = self.query_by_town_and_county(town, county)
                with open(attribute_cache, "w") as op:
                    json.dump(geojson_response, op)
            well_features += geojson_response['features']
            print(f"  result count: {len(geojson_response['features'])}")

        wells_json = dict()
        for well in well_features:
            wells_json[well['properties']['WI_UNIQUE_WELL_NO']] = well
        print(f"total unique wells retrieved {len(wells_json)}")

        return wells_json
    
    def import_wells(self, wells_geojson):

        existing_wells = Well.objects.values_list('wi_unique_well_no', flat=True)

        ct = 0
        for wid in sorted(wells_geojson.keys()):
            if wid not in existing_wells:
                feature = wells_geojson[wid]

                long = feature['geometry']['coordinates'][0]
                lat = feature['geometry']['coordinates'][1]

                try:
                    well_date = feature['properties']['WELL_COMPLETE_DATE']
                except KeyError:
                    well_date = feature['properties']['WELL_CONSTRUCT_DATE']
                if well_date is not None:
                    well_date = datetime.utcfromtimestamp(well_date/1000)

                props = feature['properties']

                obj = Well.objects.create(pk=props['WI_UNIQUE_WELL_NO'])

                obj.wi_unique_well_no = props['WI_UNIQUE_WELL_NO']
                # watr_seq_no = props['WATR_SEQ_NO'],
                obj.dnr_lat_dd_amt = props['CALC_LL_LAT_DD_AMT']
                obj.dnr_long_dd_amt = props['CALC_LL_LONG_DD_AMT']
                obj.survey_township = props['CALC_PLSS_TOWNSHIP']
                obj.survey_range = props['CALC_PLSS_RANGE']
                obj.survey_range_dir = props['CALC_PLSS_RANGE_DIR']
                obj.survey_section = props['CALC_PLSS_SECTION']
                obj.q_section = props['CALC_PLSS_Q_SECTION']
                obj.qq_section = props['CALC_PLSS_QQ_SECTION']
                obj.well_addr = props['WELL_STREET_ADDRESS']
                obj.owner_mailing_addr = props['OWNER_ADDRESS']
                # esri_oid = props['ESRI_OID'],
                obj.muni = props['MUNICIPALITY_NAME']
                obj.well_depth_amt = props['WELL_DEPTH_FT']
                # well_depth_amt_text = props['WELL_DEPTH_AMT_TEXT'],
                obj.constructor_name = props['CONSTRUCTOR_NAME']
                obj.well_complete_date = well_date
                obj.well_status = props['WELL_STATUS']
                obj.static_depth_amt = props['STATIC_WATER_LEVEL_FT']
                obj.static_depth_above_below = props['STATIC_WATER_LEV_ABOVE_BELOW']
                obj.location_method = props['LOCATION_METHOD']
                obj.casing_depth_amt = props['CASING_DEPTH_FT']
                # casing_depth_amt_txt = props['CASING_DEPTH_AMT_TXT'],
                # decade_complete = props['DECADE_COMPLETE'],
                obj.well_constr_url = props['WELL_CONSTR_URL']
                obj.geom = f"POINT ({long} {lat})"
                obj.save()
                print(f"{wid}, ", end="")
                ct += 1

                # new_obj = Well(
                #     wi_unique_well_no = props['WI_UNIQUE_WELL_NO'],
                #     # watr_seq_no = props['WATR_SEQ_NO'],
                #     dnr_lat_dd_amt = props['CALC_LL_LAT_DD_AMT'],
                #     dnr_long_dd_amt = props['CALC_LL_LONG_DD_AMT'],
                #     survey_township = props['CALC_PLSS_TOWNSHIP'],
                #     survey_range = props['CALC_PLSS_RANGE'],
                #     survey_range_dir = props['CALC_PLSS_RANGE_DIR'],
                #     survey_section = props['CALC_PLSS_SECTION'],
                #     q_section = props['CALC_PLSS_Q_SECTION'],
                #     qq_section = props['CALC_PLSS_QQ_SECTION'],
                #     well_addr = props['WELL_STREET_ADDRESS'],
                #     owner_mailing_addr = props['OWNER_ADDRESS'],
                #     # esri_oid = props['ESRI_OID'],
                #     muni = props['MUNICIPALITY_NAME'],
                #     well_depth_amt = props['WELL_DEPTH_FT'],
                #     # well_depth_amt_text = props['WELL_DEPTH_AMT_TEXT'],
                #     constructor_name = props['CONSTRUCTOR_NAME'],
                #     well_complete_date = well_date,
                #     well_status = props['WELL_STATUS'],
                #     static_depth_amt = props['STATIC_WATER_LEVEL_FT'],
                #     static_depth_above_below = props['STATIC_WATER_LEV_ABOVE_BELOW'],
                #     location_method = props['LOCATION_METHOD'],
                #     casing_depth_amt = props['CASING_DEPTH_FT'],
                #     # casing_depth_amt_txt = props['CASING_DEPTH_AMT_TXT'],
                #     # decade_complete = props['DECADE_COMPLETE'],
                #     well_constr_url = props['WELL_CONSTR_URL'],
                #     geom = f"POINT ({long} {lat})"
                # )

                # new_obj.save()

        print(f"{ct} new wells imported.")

    def query_dnr_by_town_shape(self, town_name):

        obj = TownUnit.objects.get(mcd_name=town_name)

        # the full rings work for a lot of towns, but once the geometry gets a bit complicated
        # e.g. river boundaries, I started getting 404 responses from the REST server
        full_rings = [[[round(i[0], 4), round(i[1], 4)] for i in obj.geom.coords[0][0]]]
        full_rings_str = str(full_rings).replace(" ","")

        # the most basic rings we can use is an envelope (bounding box), but this is a pretty
        # clumsy method if we really only want to get the wells within a town
        env_rings = [[[round(i[0], 4), round(i[1], 4)] for i in obj.geom.envelope.coords[0]]]
        env_rings_str = str(env_rings).replace(" ","")

        # seems like a nice balance may be convex_hull, the "smallest polygon that contains"
        # all points in a polygon
        hull_rings = [[[round(i[0], 4), round(i[1], 4)] for i in obj.geom.convex_hull.coords[0]]]
        hull_rings_str = str(hull_rings).replace(" ","")

        # NOT CURRENTLY IN USE, OVERWRITTEN BY HULL RINGS BELOW
        if len(full_rings_str) > 3000:
            print("shape too complex, using bounding box")
            use_rings = env_rings_str
        else:
            print("using real town boundary")
            use_rings = full_rings_str

        use_rings = hull_rings_str

        simple_ring = [[
          [-90.9555, 43.1204],
          [-90.9246, 43.1195],
          [-90.9254, 43.1044],
          [-90.9546, 43.1042]
        ]]

        baseurl = "https://dnrmaps.wi.gov/arcgis2/rest/services/DG_Groundwater_Retrieval_Network/DG_Groundwater_Retrieval_Network_Ext/MapServer/0/query?"
        params = {
            'inSR': "4326",
            'spatialRel': "esriSpatialRelContains",
            'geometryType': "esriGeometryPolygon",
            'geometry': urllib.parse.quote('{"rings":'+use_rings+'}'),
            'outSR': "4326",
            'outFields': "*",
            'f': "geojson"
        }
        params_str = "&".join([f"{k}={params[k]}" for k in params.keys()])
        url = f"{baseurl}{params_str}"
        if self.verbose:
            print(url)

        response = urllib.request.urlopen(url)
        content = response.read()
        return json.loads(content)

    def query_by_town_and_county(self, town, county):

        baseurl = "https://dnrmaps.wi.gov/arcgis2/rest/services/DG_Groundwater_Retrieval_Network/DG_Groundwater_Retrieval_Network_Ext/MapServer/0/query?"
        params = {
            'where': urllib.parse.quote(f"\"CALC_COUNTY_NAME\"='{county}'AND\"MUNICIPALITY_NAME\"='Town of {town.upper()}'"),
            'outSR': "4326",
            'outFields': "*",
            'f': "geojson"
        }
        params_str = "&".join([f"{k}={params[k]}" for k in params.keys()])
        url = f"{baseurl}{params_str}"
        if self.verbose:
            print(url)
        response = urllib.request.urlopen(url)
        content = response.read()
        return json.loads(content)

    def load_from_geojson(self):

        TownUnit.objects.all().delete()

        input_geojson = "/home/adam/Octavian/LegionGIS/CSP/web-app/town_units3.geojson"
        ds = DataSource(input_geojson)

        for feat in ds[0]:
            unit = TownUnit()
            unit.mcd_name = feat.get('MCD_NAME')
            unit.county_name = feat.get('CNTY_NAME')
            unit.notes = feat.get('NOTES')
            unit.geom = feat.geom.wkt

            unit.save()
