from datetime import datetime
from pathlib import Path
from django.contrib.gis.geos import GEOSGeometry, MultiPolygon
from django.contrib.gis.gdal import DataSource
from django.core.management.base import BaseCommand, CommandError
from reference_layers.models import (
    County,
    MinorCivilDivision,
    PLSSTownship,
    PLSSSection,
    PLSSQuarterSection,
)

class Command(BaseCommand):
    help = 'load fracture line CSV populate database.'

    def add_arguments(self, parser):
        parser.add_argument(
            'data_dir',
            help='path to directory that holds all necessary shapefiles',
        )
        parser.add_argument(
            'county',
            nargs="+",
            help='name of one or more counties to load reference data for',
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
            County.objects.all().delete()
            MinorCivilDivision.objects.all().delete()
            PLSSTownship.objects.all().delete()
            PLSSSection.objects.all().delete()
            PLSSQuarterSection.objects.all().delete()

        for county in options['county']:
            self.process_county(options['data_dir'], county)

    def process_county(self, data_dir, county_name):

        start = datetime.now()

        county_lyr = self.get_lyr_from_shp(Path(data_dir, 'counties', 'county_nrcs_a_wi.shp'))
        mcd_lyr = self.get_lyr_from_shp(Path(data_dir, 'mcd', 'WI_Cities_Towns_and_Villages_Fall_2017.shp'))
        township_lyr = self.get_lyr_from_shp(Path(data_dir, 'plss_townships', 'twpppoly4326.shp'))
        section_lyr = self.get_lyr_from_shp(Path(data_dir, 'plss_sections', 'secrdtrs4326.shp'))
        qsection_lyr = self.get_lyr_from_shp(Path(data_dir, 'plss_qsections', 'qscppoly4326.shp'))

        print("loading county...")
        county_feat = None
        for feat in county_lyr:
            if feat.get('COUNTYNAME').lower() == county_name.lower():
                county_feat = feat
        if county_feat is None:
            print("can't find this county, cancelling")
            exit()

        fips = county_feat.get('FIPS_I')
        county_obj, created = County.objects.get_or_create(fips=fips)
        county_obj.name = county_feat.get('COUNTYNAME')
        county_obj.state_name = county_feat.get('STATENAME')
        county_obj.geom = self.ensure_multipolygon(county_feat.geom)
        county_obj.save()
        print(f"  {county_obj.name} county loaded")

        print("loading minor civil divisions...")
        ct = 0
        for feat in mcd_lyr:
            if int(feat.get('CNTY_FIPS')) == county_obj.fips:
                ct += 1
                geoid = int(feat.get('GEOID'))
                mcd, created = MinorCivilDivision.objects.get_or_create(
                    geoid=geoid
                )
                mcd.county = county_obj
                mcd.ctv = feat.get('CTV')
                mcd.name = feat.get('MCD_NAME')
                geom = self.ensure_multipolygon(feat.geom)
                mcd.geom = geom
                mcd.save()
        print(f"  {ct} loaded")

        print("loading townships...")
        townships = []
        for feat in township_lyr:
            if county_obj.geom.intersects(GEOSGeometry(feat.geom.wkt)):
                geom = self.ensure_multipolygon(feat.geom)
                twp, created = PLSSTownship.objects.get_or_create(
                    dir=feat.get("DIR"),
                    twp=feat.get("TWP"),
                    rng=feat.get("RNG"),
                )
                twp.geom = geom
                twp.save()
                townships.append(twp)
        print(f"  {len(townships)} loaded")
        dtr_list = [(i.dir, i.twp, i.rng) for i in townships]

        print("loading sections...")
        sections = []
        for feat in section_lyr:
            dtr = (int(feat.get("DIR")), int(feat.get("TWP")), int(feat.get("RNG")))
            if dtr in dtr_list:
                t = PLSSTownship.objects.get(dir=dtr[0], twp=dtr[1], rng=dtr[2])
                geom = self.ensure_multipolygon(feat.geom)
                sec, created = PLSSSection.objects.get_or_create(
                    dir=feat.get("DIR"),
                    twp=feat.get("TWP"),
                    rng=feat.get("RNG"),
                    sec=feat.get("SEC"),
                )
                sec.township = t
                sec.geom = geom
                sec.save()
                sections.append(sec)
        print(f"  {len(sections)} loaded")
        dtrs_list = [(i.dir, i.twp, i.rng, i.sec) for i in sections]

        print("loading quarter sections...")
        qsections = []
        for feat in qsection_lyr:
            dtrs = (
                int(feat.get("D")),
                int(feat.get("T")),
                int(feat.get("R")),
                int(feat.get("S")),
            )
            if dtrs in dtrs_list:
                s = PLSSSection.objects.get(dir=dtrs[0], twp=dtrs[1], rng=dtrs[2], sec=dtrs[3])
                geom = self.ensure_multipolygon(feat.geom)
                qsec, created = PLSSQuarterSection.objects.get_or_create(
                    dir=feat.get("D"),
                    twp=feat.get("T"),
                    rng=feat.get("R"),
                    sec=feat.get("S"),
                    qsec=feat.get("Q"),
                )
                qsec.section = s
                qsec.geom = geom
                qsec.save()
                qsections.append(qsec)
        print(f"  {len(qsections)} loaded")
        print(f"seconds elapsed: {datetime.now() - start}")

    def ensure_multipolygon(self, geom):
        geom = GEOSGeometry(geom.wkt)
        if geom.geom_type == "Polygon":
            geom = MultiPolygon([geom])
        return geom

    def get_lyr_from_shp(self, file_path):
        ds = DataSource(file_path)
        lyr = ds[0]
        return lyr


