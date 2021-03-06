# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-11-03 19:50
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cspkarst', '0002_auto_20171103_0207'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sink',
            name='sink_type',
            field=models.CharField(blank=True, choices=[('CATCHMENT', 'Catchment Basin'), ('SINKHOLE', 'Sinkhole/Karst Feature'), ('QUARRY', 'Quarry'), ('DC', 'Ditch/Culvert'), ('FOUNDATION', 'Building Foundation'), ('OTHER', 'Other'), ('UNKNOWN', 'Unknown')], max_length=20),
        ),
    ]
