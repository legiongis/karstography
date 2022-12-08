# Generated by Django 3.0.4 on 2021-02-13 20:13

import django.contrib.gis.db.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cspkarst', '0011_pointofinterest'),
    ]

    operations = [
        migrations.AddField(
            model_name='well',
            name='geo_corrected',
            field=models.BooleanField(blank=True, max_length=650, null=True, verbose_name='Geometry corrected?'),
        ),
        migrations.AddField(
            model_name='well',
            name='geo_corrected_by',
            field=models.CharField(blank=True, max_length=100, null=True, verbose_name='Geometry corrected by'),
        ),
        migrations.AddField(
            model_name='well',
            name='geo_corrected_time',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Geometry corrected on'),
        ),
        migrations.AlterField(
            model_name='well',
            name='casing_depth_amt',
            field=models.FloatField(blank=True, null=True, verbose_name='Casing Depth'),
        ),
        migrations.AlterField(
            model_name='well',
            name='casing_depth_amt_txt',
            field=models.CharField(blank=True, max_length=45, null=True, verbose_name='Casing Depth - text'),
        ),
        migrations.AlterField(
            model_name='well',
            name='constructor_name',
            field=models.CharField(blank=True, max_length=60, null=True, verbose_name='Constructor Name'),
        ),
        migrations.AlterField(
            model_name='well',
            name='decade_complete',
            field=models.CharField(blank=True, max_length=15, null=True, verbose_name='Decade Completed'),
        ),
        migrations.AlterField(
            model_name='well',
            name='dnr_lat_dd_amt',
            field=models.FloatField(blank=True, null=True, verbose_name='DNR Lat.'),
        ),
        migrations.AlterField(
            model_name='well',
            name='dnr_long_dd_amt',
            field=models.FloatField(blank=True, null=True, verbose_name='DNR Long.'),
        ),
        migrations.AlterField(
            model_name='well',
            name='esri_oid',
            field=models.IntegerField(blank=True, null=True, verbose_name='ESRI OID'),
        ),
        migrations.AlterField(
            model_name='well',
            name='geom',
            field=django.contrib.gis.db.models.fields.PointField(null=True, srid=4326, verbose_name='Location'),
        ),
        migrations.AlterField(
            model_name='well',
            name='location_method',
            field=models.CharField(blank=True, max_length=25, null=True, verbose_name='Location Method'),
        ),
        migrations.AlterField(
            model_name='well',
            name='muni',
            field=models.CharField(blank=True, max_length=45, null=True, verbose_name='Municipality'),
        ),
        migrations.AlterField(
            model_name='well',
            name='owner_mailing_addr',
            field=models.CharField(blank=True, max_length=60, null=True, verbose_name='Owner Mailing Address'),
        ),
        migrations.AlterField(
            model_name='well',
            name='q_section',
            field=models.CharField(blank=True, max_length=2, null=True, verbose_name='Q Section'),
        ),
        migrations.AlterField(
            model_name='well',
            name='qq_section',
            field=models.CharField(blank=True, max_length=2, null=True, verbose_name='QQ Section'),
        ),
        migrations.AlterField(
            model_name='well',
            name='sample_db_url',
            field=models.CharField(blank=True, max_length=650, null=True, verbose_name='Sample DB URL'),
        ),
        migrations.AlterField(
            model_name='well',
            name='static_depth_above_below',
            field=models.CharField(blank=True, max_length=25, null=True, verbose_name='Static Depth Above Below'),
        ),
        migrations.AlterField(
            model_name='well',
            name='static_depth_amt',
            field=models.FloatField(blank=True, null=True, verbose_name='Static Depth'),
        ),
        migrations.AlterField(
            model_name='well',
            name='survey_range',
            field=models.IntegerField(blank=True, null=True, verbose_name='Survey Range'),
        ),
        migrations.AlterField(
            model_name='well',
            name='survey_range_dir',
            field=models.CharField(blank=True, max_length=1, null=True, verbose_name='Survey Range Dir.'),
        ),
        migrations.AlterField(
            model_name='well',
            name='survey_section',
            field=models.IntegerField(blank=True, null=True, verbose_name='Survey Section'),
        ),
        migrations.AlterField(
            model_name='well',
            name='survey_township',
            field=models.IntegerField(blank=True, null=True, verbose_name='Survey Township'),
        ),
        migrations.AlterField(
            model_name='well',
            name='watr_seq_no',
            field=models.IntegerField(blank=True, null=True, verbose_name='Water Seq No.'),
        ),
        migrations.AlterField(
            model_name='well',
            name='well_addr',
            field=models.CharField(blank=True, max_length=100, null=True, verbose_name='Well Address'),
        ),
        migrations.AlterField(
            model_name='well',
            name='well_complete_date',
            field=models.DateField(blank=True, null=True, verbose_name='Well Completion Date'),
        ),
        migrations.AlterField(
            model_name='well',
            name='well_constr_url',
            field=models.CharField(blank=True, max_length=115, null=True, verbose_name='WCR URL'),
        ),
        migrations.AlterField(
            model_name='well',
            name='well_depth_amt',
            field=models.FloatField(blank=True, null=True, verbose_name='Well Depth'),
        ),
        migrations.AlterField(
            model_name='well',
            name='well_depth_amt_text',
            field=models.CharField(blank=True, max_length=45, null=True, verbose_name='Well Depth - text'),
        ),
        migrations.AlterField(
            model_name='well',
            name='well_status',
            field=models.CharField(blank=True, max_length=15, null=True, verbose_name='Well Status'),
        ),
        migrations.AlterField(
            model_name='well',
            name='wi_unique_well_no',
            field=models.CharField(max_length=6, primary_key=True, serialize=False, verbose_name='WI Unique Well ID'),
        ),
    ]