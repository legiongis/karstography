# Generated by Django 3.2.14 on 2023-03-02 18:43

from django.db import connection
from django.db import migrations, models

def remove_sink_views(apps,schema_editor):
    '''adds new db views categorizing sinks by their depth. this is mostly to support
    easier layering in geoserver'''

    cursor = connection.cursor()
    cursor.execute("DROP VIEW IF EXISTS cspkarst_sinkholes;")
    cursor.execute("DROP VIEW IF EXISTS cspkarst_sink_01;")
    cursor.execute("DROP VIEW IF EXISTS cspkarst_sink_12;")
    cursor.execute("DROP VIEW IF EXISTS cspkarst_sink_25;")
    cursor.execute("DROP VIEW IF EXISTS cspkarst_sink_5;")

    return

def reverse_remove_sink_views(apps, schema_editor):
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('cspkarst', '0014_fractureline'),
    ]

    operations = [
        migrations.RunPython(remove_sink_views, reverse_remove_sink_views),
        migrations.AlterField(
            model_name='fractureline',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='pointofinterest',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='sink',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='sink',
            name='in_nfhl',
            field=models.BooleanField(null=True),
        ),
        migrations.AlterField(
            model_name='sink',
            name='in_row',
            field=models.BooleanField(null=True),
        ),
        migrations.AlterField(
            model_name='townunit',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
