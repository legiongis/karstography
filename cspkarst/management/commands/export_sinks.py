import json
from datetime import datetime
from pathlib import Path
import zipfile

from django.conf import settings
from django.core import management
from django.core.management.base import BaseCommand, CommandError
from django.core.serializers import serialize

import geopandas as gpd

from cspkarst.models import Sink

class Command(BaseCommand):
    help = 'Export sinks from database, optionally filter by sink_type.'

    def add_arguments(self, parser):
        parser.add_argument(
            '-t',
            '--sink_type',
            choices=[i[0] for i in Sink.TYPE_CHOICES],
            help='include only one sink_type in the export',
        )

    def handle(self, *args, **options):

        exports_dir = Path(settings.CACHE_DIR, "exports")
        exports_dir.mkdir(exist_ok=True, parents=True)

        sink_type = options['sink_type']
        basename = f"sinks{datetime.now().strftime('%Y%m%d')}"
        if sink_type:
            basename += f"_{sink_type}"

        sinks = Sink.objects.all()
        if sink_type:
            sinks = sinks.filter(sink_type=sink_type)
        print(f"writing {sinks.count()} features...")

        geojson = json.loads(serialize("geojson", sinks,
            geometry_field="geom",
            fields=[
                "sink_id",
                "sink_type",
                "dem_check",
                "img_check",
                "evidence",
                "depth",
                "depth_cat",
                "elevation",
                "in_nfhl",
                "in_row",
                "bm_hs",
                "bm_aerial",
                "bm_usgs",
                "bm_tpi",
                "field_chk",
                "field_eval",
                "confidence",
                "comment",
                # "last_update",
                "event_no",
            ]
        ))

        df = gpd.GeoDataFrame.from_features(geojson['features'])
        df.set_crs(epsg=4326, inplace=True)

        shp_path = Path(exports_dir, f"{basename}.shp")
        df.to_file(shp_path)

        zip_path = self.zip_shapefile(shp_path)
        print(zip_path)

    def zip_shapefile(self, shp_path: Path):

        files = [
            Path(shp_path.parent, f"{shp_path.stem}.cpg"),
            Path(shp_path.parent, f"{shp_path.stem}.dbf"),
            Path(shp_path.parent, f"{shp_path.stem}.prj"),
            Path(shp_path.parent, f"{shp_path.stem}.shp"),
            Path(shp_path.parent, f"{shp_path.stem}.shx"),
        ]

        out_path = Path(shp_path.parent, f"{shp_path.stem}.zip")

        with zipfile.ZipFile(out_path, mode="w" ) as outzip:
            for f in files:
                print(f)
                outzip.write(f, f.name, compress_type=zipfile.ZIP_DEFLATED)

        return out_path
