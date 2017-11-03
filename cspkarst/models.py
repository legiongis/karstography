from __future__ import unicode_literals

from django.contrib.gis.db import models
from django.core.serializers import serialize
from django.core.files.uploadedfile import SimpleUploadedFile

from PIL import Image
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

    sink_id = models.IntegerField(null=True,blank=True)
    sink_type = models.CharField(max_length=20,choices=TYPE_CHOICES,blank=True)
    dem_check = models.IntegerField(null=True,blank=True)
    img_check = models.IntegerField(null=True,blank=True)
    evidence = models.CharField(max_length=1,blank=True,null=True)
    depth = models.FloatField(null=True,blank=True)
    elevation = models.FloatField(null=True,blank=True)
    in_nfhl = models.NullBooleanField()
    in_row = models.NullBooleanField()
    bm_hs = models.BooleanField(default=False)
    bm_aerial = models.BooleanField(default=False)
    bm_tpi = models.BooleanField(default=False)
    bm_usgs = models.BooleanField(default=False)
    confidence = models.CharField(max_length=20,choices=CON_CHOICES,blank=True,null=True)
    comment = models.TextField(max_length=254,blank=True,null=True)
    geom = models.PointField(null=True)
    
    
