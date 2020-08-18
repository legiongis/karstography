from __future__ import unicode_literals

from django.contrib.gis.db import models
from django.core.serializers import serialize
from django.core.files.uploadedfile import SimpleUploadedFile

import os

class Sink(models.Model):

    TYPE_CHOICES = (
       ("CATCHMENT","Catchment Basin"),
       ("SINKHOLE","Sinkhole/Karst Feature"),
       ("QUARRY","Quarry"),
       ("DC","Ditch/Culvert"),
       ("FOUNDATION","Building Foundation"),
       ("OTHER","Other"),
       ("UNKNOWN","Unknown"),
    )

    CON_CHOICES = (
       ("PROBABLE","Probable"),
       ("POSSIBLE","Possible"),
    )

    DEPTH_CAT_CHOICES = (
       ("0-1","0-1 ft"),
       ("1-2","1-2 ft"),
       ("2-5","2-5 ft"),
       ("5+","5+ ft"),
    )

    sink_id = models.IntegerField(null=True,blank=True)
    sink_type = models.CharField(max_length=20,choices=TYPE_CHOICES,blank=True)
    dem_check = models.IntegerField(null=True,blank=True)
    img_check = models.IntegerField(null=True,blank=True)
    evidence = models.CharField(max_length=1,blank=True,null=True)
    depth = models.FloatField(null=True,blank=True)
    depth_cat = models.CharField(max_length=20,choices=DEPTH_CAT_CHOICES,null=True,blank=True)
    elevation = models.FloatField(null=True,blank=True)
    in_nfhl = models.NullBooleanField()
    in_row = models.NullBooleanField()
    bm_hs = models.BooleanField(default=False)
    bm_aerial = models.BooleanField(default=False)
    bm_tpi = models.BooleanField(default=False)
    bm_usgs = models.BooleanField(default=False)
    field_chk = models.BooleanField(default=False)
    field_eval = models.CharField(max_length=20,choices=CON_CHOICES,blank=True,null=True)
    confidence = models.CharField(max_length=20,choices=CON_CHOICES,blank=True,null=True)
    comment = models.TextField(max_length=254,blank=True,null=True)
    last_update = models.DateTimeField(auto_now=True)
    event_no = models.IntegerField(null=True,blank=True)
    geom = models.PointField(null=True)



    def save(self, *args, **kwargs):
        if self.depth is not None:
            if self.depth < 1:
                self.depth_cat = "0-1"
            elif self.depth < 2:
                self.depth_cat = "1-2"
            elif self.depth < 5:
                self.depth_cat = "2-5"
            else:
                self.depth_cat = "5+"
        super(Sink, self).save(*args, **kwargs)
        return

class TownUnit(models.Model):

    mcd_name = models.CharField(max_length=50,null=True,blank=True)
    county_name = models.CharField(max_length=50,null=True,blank=True)
    notes = models.CharField(max_length=100,null=True,blank=True)
    geom = models.MultiPolygonField(null=True)

    def __str__(self):
        return f"{self.mcd_name} - {self.county_name}"

class Well(models.Model):

    wi_unique_well_no = models.CharField(primary_key=True, max_length=6)
    watr_seq_no = models.IntegerField(null=True, blank=True)
    dnr_lat_dd_amt = models.FloatField(null=True, blank=True)
    dnr_long_dd_amt = models.FloatField(blank=True, null=True)
    survey_township = models.IntegerField(null=True, blank=True)
    survey_range = models.IntegerField(null=True, blank=True)
    survey_range_dir = models.CharField(max_length=1, blank=True, null=True)
    survey_section = models.IntegerField(null=True, blank=True)
    q_section = models.CharField(max_length=2, blank=True, null=True)
    qq_section = models.CharField(max_length=2, blank=True, null=True)
    well_addr = models.CharField(max_length=100, blank=True, null=True)
    owner_mailing_addr = models.CharField(max_length=60, blank=True, null=True)
    esri_oid = models.IntegerField(null=True, blank=True)
    muni = models.CharField(max_length=45, blank=True, null=True)
    well_depth_amt = models.FloatField(null=True, blank=True)
    well_depth_amt_text = models.CharField(max_length=45, blank=True, null=True)
    constructor_name = models.CharField(max_length=60, blank=True, null=True)
    well_complete_date = models.DateField(blank=True, null=True)
    well_status = models.CharField(max_length=15, blank=True, null=True)
    static_depth_amt = models.FloatField(null=True, blank=True)
    static_depth_above_below = models.CharField(max_length=25, blank=True, null=True)
    location_method = models.CharField(max_length=25, blank=True, null=True)
    casing_depth_amt = models.FloatField(null=True, blank=True)
    casing_depth_amt_txt = models.CharField(max_length=45, blank=True, null=True)
    decade_complete = models.CharField(max_length=15, blank=True, null=True)
    well_constr_url = models.CharField(max_length=115, blank=True, null=True)
    sample_db_url = models.CharField(max_length=650, blank=True, null=True)
    geom = models.PointField(null=True)

    def __str__(self):
        return self.pk

    def save(self, *args, **kwargs):
        url = "https://prodoasext.dnr.wi.gov/inter1/pk_wr583_sample_query.p_sample_list?"\
        "i_county=HIDDEN&i_township=HIDDEN&i_range=HIDDEN&i_range_dir=&i_section=HIDDEN"\
        f"&i_wuwn=HIDDEN&i_wuwn={self.wi_unique_well_no}&i_wuwn=&i_wuwn=&i_wuwn=&i_wuwn="\
        "&i_well_use=HIDDEN&i_well_use=&i_watershed=HIDDEN&i_watershed=&i_labslip=HIDDEN"\
        "&i_labslip=&i_labslip=&i_labslip=&i_labslip=&i_labslip=&i_sample_from="\
        "&i_sample_to=&i_dg_samples=HIDDEN&i_dg_samples=YES&i_pw_samples=HIDDEN&"\
        "i_pw_samples=YES&i_sw_samples=HIDDEN&i_storet_group=&i_storet=HIDDEN&i_storet="\
        "&i_storet=&i_storet=&i_storet=&i_storet=&i_cas=HIDDEN&i_cas=&i_cas=&i_cas=&i_cas=&i_cas="\
        "&i_res_criteria=ALL&i_storet_index=1"
        self.sample_db_url = url
        super(Well, self).save(*args, **kwargs)
