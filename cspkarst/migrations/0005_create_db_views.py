# -*- coding: utf-8 -*-
# written by Adam 11-07-17
from __future__ import unicode_literals

from django.db import migrations, models
from django.db import connection
from cspkarst.models import Sink

def add_db_views(apps,schema_editor):
    '''adds new db views categorizing sinks by their depth. this is mostly to support
    easier layering in geoserver'''

    cursor = connection.cursor()
    
    depth_cats = dict(Sink._meta.get_field('depth_cat').choices)
    for d in depth_cats:
        clean = "".join([i for i in d if not i in ["-","+"]])
        sql = """
        CREATE OR REPLACE VIEW cspkarst_sink_{} AS
            SELECT * FROM cspkarst_sink
            WHERE depth_cat='{}'
        """.format(clean,d)
        cursor.execute(sql)
    
    return

class Migration(migrations.Migration):

    dependencies = [
        ('cspkarst', '0004_sink_depth_cat'),
    ]

    operations = [
        migrations.RunPython(add_db_views),
    ]
