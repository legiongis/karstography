# Generated by Django 3.0.4 on 2020-08-14 22:01

import django.contrib.gis.db.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cspkarst', '0008_auto_20180727_1415'),
    ]

    operations = [
        migrations.CreateModel(
            name='TownUnit',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('mcd_name', models.CharField(blank=True, max_length=50, null=True)),
                ('county_name', models.CharField(blank=True, max_length=50, null=True)),
                ('notes', models.CharField(blank=True, max_length=100, null=True)),
                ('geom', django.contrib.gis.db.models.fields.MultiPolygonField(null=True, srid=4326)),
            ],
        ),
    ]