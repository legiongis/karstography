# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-11-06 16:50
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cspkarst', '0003_auto_20171103_1450'),
    ]

    operations = [
        migrations.AddField(
            model_name='sink',
            name='depth_cat',
            field=models.CharField(blank=True, choices=[('0-1', '0-1 ft'), ('1-2', '1-2 ft'), ('2-5', '2-5 ft'), ('5+', '5+ ft')], max_length=20, null=True),
        ),
    ]
