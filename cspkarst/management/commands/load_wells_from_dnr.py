import os
import json
import urllib.request
from datetime import datetime
from django.core import management
from django.core.management.base import BaseCommand, CommandError
from django.contrib.gis.gdal import DataSource
from cspkarst.models import TownUnit, Well


class Command(BaseCommand):
    help = 'drops and recreates the app database.'

    def add_arguments(self, parser):
        parser.add_argument(
            'town_name',
            help='forces the continuation of any command that has a confirmation prompt',
        )


    def handle(self, *args, **options):

        town_name = options['town_name'].upper()
        self.get_wells_geojson(town_name)
        # self.load_from_geojson()

    def get_wells_geojson(self, town_name):

        try:
            obj = TownUnit.objects.get(mcd_name=town_name)
        except TownUnit.DoesNotExist:
            print(f"invalid town name {town_name}")
            exit()

        cache_path_shape = os.path.join("cspkarst", "dnr_well_cache", f"{town_name}_by_shape.geojson")
        if os.path.isfile(cache_path_shape):
            print("using cached spatial query results")
            with open(cache_path_shape, "r") as op:
                sq_data = json.loads(op.read())
        else:
            sq_data = self.query_dnr_by_town_shape(town_name, cache_path=cache_path_shape)

        cache_path_attribute = os.path.join("cspkarst", "dnr_well_cache", f"{town_name}_by_attribute.geojson")
        if os.path.isfile(cache_path_attribute):
            print("using cached attribute query results")
            with open(cache_path_attribute, "r") as op:
                aq_data = json.loads(op.read())
        else:
            aq_data = self.query_dnr_by_town_name(town_name, cache_path=cache_path_attribute)

        wells_json = dict()
        for well in sq_data['features'] + aq_data['features']:
            wells_json[well['properties']['WI_UNIQUE_WELL_NO']] = well
        print(f"total unique wells retrieved {len(wells_json)}")

        existing_wells = Well.objects.values_list('wi_unique_well_no', flat=True)

        for wid, feature in wells_json.items():
            if wid in existing_wells:
                continue

            long = feature['geometry']['coordinates'][0]
            lat = feature['geometry']['coordinates'][1]

            well_date = feature['properties']['WELL_COMPLETE_DATE']
            if well_date is not None:
                well_date = datetime.utcfromtimestamp(well_date/1000)

            props = feature['properties']
            new_obj = Well(
                wi_unique_well_no = props['WI_UNIQUE_WELL_NO'],
                watr_seq_no = props['WATR_SEQ_NO'],
                dnr_lat_dd_amt = props['LL_LAT_DD_AMT'],
                dnr_long_dd_amt = props['LL_LONG_DD_AMT'],
                survey_township = props['SURVEY_TOWNSHIP'],
                survey_range = props['SURVEY_RANGE'],
                survey_range_dir = props['SURVEY_RANGE_DIR'],
                survey_section = props['SURVEY_SECTION'],
                q_section = props['Q_SECTION'],
                qq_section = props['QQ_SECTION'],
                well_addr = props['WELL_ADDR'],
                owner_mailing_addr = props['OWNER_MAILING_ADDR'],
                esri_oid = props['ESRI_OID'],
                muni = props['MUNI'],
                well_depth_amt = props['WELL_DEPTH_AMT'],
                well_depth_amt_text = props['WELL_DEPTH_AMT_TEXT'],
                constructor_name = props['CONSTRUCTOR_NAME'],
                well_complete_date = well_date,
                well_status = props['WELL_STATUS'],
                static_depth_amt = props['STATIC_DEPTH_AMT'],
                static_depth_above_below = props['STATIC_DEPTH_ABOVE_BELOW'],
                location_method = props['LOCATION_METHOD'],
                casing_depth_amt = props['CASING_DEPTH_AMT'],
                casing_depth_amt_txt = props['CASING_DEPTH_AMT_TXT'],
                decade_complete = props['DECADE_COMPLETE'],
                well_constr_url = props['WELL_CONSTR_URL'],
                geom = f"POINT ({long} {lat})"
            )
            new_obj.save()

    def query_dnr_by_town_shape(self, town_name, cache_path=''):

        obj = TownUnit.objects.get(mcd_name=town_name)

        full_rings = [[[round(i[0], 4), round(i[1], 4)] for i in obj.geom.coords[0][0]]]
        full_rings_str = str(full_rings).replace(" ","")
        env_rings = [[[round(i[0], 4), round(i[1], 4)] for i in obj.geom.envelope.coords[0]]]
        env_rings_str = str(env_rings).replace(" ","")

        if len(full_rings_str) > 3000:
            print("shape too complex, using bounding box")
            use_rings = env_rings_str
        else:
            print("using real town boundary")
            use_rings = full_rings_str

        simple_ring = [[
          [-90.9555, 43.1204],
          [-90.9246, 43.1195],
          [-90.9254, 43.1044],
          [-90.9546, 43.1042]
        ]]

        baseurl = "https://dnrmaps.wi.gov/arcgis/rest/services/DG_Well_Driller/"\
            "DG_Well_Driller_WTM_Ext/MapServer/0/query?"

        ## ORIGINALLY USED REQUESTS, NOT USED ANYMORE
        # params = {
        #     ## 'where': "\"MUNI\"='TOWN OF EASTMAN'",
        #     'inSR': "4326",
        #     'spatialRel': "esriSpatialRelContains",
        #     'geometryType': "esriGeometryPolygon",
        #     'geometry': "{\"rings\": "+ str(rings).replace(" ","") +"}",
        #     'outSR': "4326",
        #     'outFields': "*",
        #     'f': "geojson"
        # }
        # resp = requests.post(url=baseurl, params=params)
        # data = resp.json()

        ## first query using the boundary of the town
        sq_url = f"{baseurl}inSR=4326&spatialRel=esriSpatialRelContains"\
            f"&geometryType=esriGeometryPolygon"\
            "&geometry={\"rings\":"+use_rings+"}"\
            f"&outSR=4326&outFields=*&f=geojson"
        response = urllib.request.urlopen(sq_url)
        content = response.read()
        sq_data = json.loads(content)
        print(f"spatial query returns {len(sq_data['features'])}")

        if cache_path != '':
            with open(cache_path, "w") as op:
                json.dump(sq_data, op)

        return sq_data

    def query_dnr_by_town_name(self, town_name, cache_path=''):

        baseurl = "https://dnrmaps.wi.gov/arcgis/rest/services/DG_Well_Driller/"\
            "DG_Well_Driller_WTM_Ext/MapServer/0/query?"

        name_clause = f"\"MUNI\"='TOWN OF {town_name}'"

        ## second query uses an attribute filter
        aq_url = f"{baseurl}where=%22MUNI%22=%27TOWN%20OF%20{town_name}%27"\
            f"&outSR=4326&outFields=*&f=geojson"
        response = urllib.request.urlopen(aq_url)
        content = response.read()
        aq_data = json.loads(content)
        print(f"attribute query returns {len(aq_data['features'])}")

        if cache_path != '':
            with open(cache_path, "w") as op:
                json.dump(aq_data, op)

        return aq_data

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
