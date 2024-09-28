# Generated by Django 3.2.14 on 2023-05-02 16:51

import django.contrib.gis.db.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reference_layers', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='HydrologicUnit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=255, null=True)),
                ('category', models.CharField(editable=False, max_length=12)),
                ('huc_level', models.CharField(editable=False, max_length=10)),
                ('huc', models.CharField(max_length=12)),
                ('geom', django.contrib.gis.db.models.fields.MultiPolygonField(null=True, srid=4326)),
            ],
        ),
    ]
