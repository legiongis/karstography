# Generated by Django 3.0.4 on 2020-08-16 23:21

import django.contrib.gis.db.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cspkarst', '0009_townunit'),
    ]

    operations = [
        migrations.CreateModel(
            name='Well',
            fields=[
                ('wi_unique_well_no', models.CharField(max_length=6, primary_key=True, serialize=False)),
                ('watr_seq_no', models.IntegerField(blank=True, null=True)),
                ('dnr_lat_dd_amt', models.FloatField(blank=True, null=True)),
                ('dnr_long_dd_amt', models.FloatField(blank=True, null=True)),
                ('survey_township', models.IntegerField(blank=True, null=True)),
                ('survey_range', models.IntegerField(blank=True, null=True)),
                ('survey_range_dir', models.CharField(blank=True, max_length=1, null=True)),
                ('survey_section', models.IntegerField(blank=True, null=True)),
                ('q_section', models.CharField(blank=True, max_length=2, null=True)),
                ('qq_section', models.CharField(blank=True, max_length=2, null=True)),
                ('well_addr', models.CharField(blank=True, max_length=100, null=True)),
                ('owner_mailing_addr', models.CharField(blank=True, max_length=60, null=True)),
                ('esri_oid', models.IntegerField(blank=True, null=True)),
                ('muni', models.CharField(blank=True, max_length=45, null=True)),
                ('well_depth_amt', models.FloatField(blank=True, null=True)),
                ('well_depth_amt_text', models.CharField(blank=True, max_length=45, null=True)),
                ('constructor_name', models.CharField(blank=True, max_length=60, null=True)),
                ('well_complete_date', models.DateField(blank=True, null=True)),
                ('well_status', models.CharField(blank=True, max_length=15, null=True)),
                ('static_depth_amt', models.FloatField(blank=True, null=True)),
                ('static_depth_above_below', models.CharField(blank=True, max_length=25, null=True)),
                ('location_method', models.CharField(blank=True, max_length=25, null=True)),
                ('casing_depth_amt', models.FloatField(blank=True, null=True)),
                ('casing_depth_amt_txt', models.CharField(blank=True, max_length=45, null=True)),
                ('decade_complete', models.CharField(blank=True, max_length=15, null=True)),
                ('well_constr_url', models.CharField(blank=True, max_length=115, null=True)),
                ('sample_db_url', models.CharField(blank=True, max_length=650, null=True)),
                ('geom', django.contrib.gis.db.models.fields.PointField(null=True, srid=4326)),
            ],
        ),
    ]
