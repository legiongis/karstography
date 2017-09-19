# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-09-18 18:00
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Sink',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('CATCHMENT', 'Catchment Basin'), ('SINKHOLE', 'Sinkhole'), ('OTHER', 'Other')], max_length=20)),
                ('dem_check', models.IntegerField()),
                ('img_check', models.IntegerField()),
                ('evidence', models.CharField(max_length=1)),
                ('depth', models.FloatField()),
                ('elevation', models.FloatField()),
                ('in_nfhl', models.NullBooleanField()),
                ('in_row', models.NullBooleanField()),
                ('comment', models.CharField(max_length=254)),
            ],
        ),
    ]
