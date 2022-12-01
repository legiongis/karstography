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


    def handle(self, *args, **options):

        self.get_wells_geojson(
            town=options['town'],
            county=options['county'],
            use_cache=not options['nocache']
        )


    def get_wells_geojson(self, town, county, use_cache=True):

        well_features = []

        use_spatial_query = False
        use_attribute_query = True

        if use_spatial_query:
            try:
                obj = TownUnit.objects.get(mcd_name=town)
            except TownUnit.DoesNotExist:
                print(f"invalid town name {town}")
                exit()
            cache_path_shape = os.path.join("cspkarst", "dnr_well_cache", f"{town}_by_shape.geojson")
            if os.path.isfile(cache_path_shape):
                print("using cached spatial query results")
                with open(cache_path_shape, "r") as op:
                    sq_data = json.loads(op.read())
            else:
                sq_data = self.query_dnr_by_town_shape(town, cache_path=cache_path_shape)
            well_features += sq_data['features']

        if use_attribute_query:
            cache_path_attribute = os.path.join("cspkarst", "dnr_well_cache", f"{town}_by_attribute.geojson")
            if os.path.isfile(cache_path_attribute) and use_cache:
                print("using cached attribute query results")
                with open(cache_path_attribute, "r") as op:
                    aq_data = json.loads(op.read())
            else:
                # aq_data = self.query_dnr_by_town_name(town, cache_path=cache_path_attribute)
                aq_data = self.query_by_town_and_county(town, county, cache_path=cache_path_attribute)
            well_features += aq_data['features']

        wells_json = dict()
        for well in well_features:
            wells_json[well['properties']['WI_UNIQUE_WELL_NO']] = well
        print(f"total unique wells retrieved {len(wells_json)}")

        existing_wells = Well.objects.values_list('wi_unique_well_no', flat=True)

        for wid, feature in wells_json.items():
            if wid in existing_wells:
                continue

            long = feature['geometry']['coordinates'][0]
            lat = feature['geometry']['coordinates'][1]

            try:
                well_date = feature['properties']['WELL_COMPLETE_DATE']
            except KeyError:
                well_date = feature['properties']['WELL_CONSTRUCT_DATE']
            if well_date is not None:
                well_date = datetime.utcfromtimestamp(well_date/1000)

            props = feature['properties']

            obj, created = Well.objects.get_or_create(pk=props['WI_UNIQUE_WELL_NO'])
            # new_obj = Well(
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

        baseurl = "https://dnrmaps.wi.gov/arcgis2/rest/services/DG_Groundwater_Retrieval_Network/DG_Groundwater_Retrieval_Network_Ext/MapServer/0/query?"


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

        sq_url = f"{baseurl}"\
            "where=&"\
            "text=&objectIds=&time=&"\
            "geometry=\"rings\":"+ use_rings +\
            "&geometryType=esriGeometryPolygon&inSR=4326&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&"\
            "outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=geojson"

        ## first query using the boundary of the town
        sq_url = f"{baseurl}inSR=4326&spatialRel=esriSpatialRelContains"\
            f"&geometryType=esriGeometryPolygon"\
            "&geometry={\"rings\":"+use_rings+"}"\
            f"&outSR=4326&outFields=*&f=geojson"
        print(sq_url)
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

        baseurl = "https://dnrmaps.wi.gov/arcgis2/rest/services/DG_Groundwater_Retrieval_Network/DG_Groundwater_Retrieval_Network_Ext/MapServer/0/query?"

        # name_clause = f"\"MUNI\"='TOWN OF {town_name}'"
        features = []

        ## second query uses an attribute filter
        # aq_url = f"{baseurl}where=%MUNICIPALITY_NAME%22=%27Town%20of%20{town_name}%27"\
        #     f"&outSR=4326&outFields=*&f=geojson"
        aq_url = f"{baseurl}where=%22CALC_COUNTY_NAME%22=%27{town_name}%27"\
            f"&outSR=4326&outFields=*&f=geojson"
        print(aq_url)
        response = urllib.request.urlopen(aq_url)
        content = response.read()
        aq_data = json.loads(content)
        print(f"attribute query returns {len(aq_data['features'])}")

        if cache_path != '':
            with open(cache_path, "w") as op:
                json.dump(aq_data, op)

        return aq_data

    def query_by_town_and_county(self, town, county, cache_path=''):

        baseurl = "https://dnrmaps.wi.gov/arcgis2/rest/services/DG_Groundwater_Retrieval_Network/DG_Groundwater_Retrieval_Network_Ext/MapServer/0/query?"

        features = []

        ## second query uses an attribute filter
        # aq_url = f"{baseurl}where=%MUNICIPALITY_NAME%22=%27Town%20of%20{town_name}%27"\
        #     f"&outSR=4326&outFields=*&f=geojson"
        aq_url = f"{baseurl}where=%22CALC_COUNTY_NAME%22=%27{county}%27AND%22MUNICIPALITY_NAME%22=%27Town%20of%20{town.upper()}%27"\
            f"&outSR=4326&outFields=*&f=geojson"
        print(aq_url)
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
