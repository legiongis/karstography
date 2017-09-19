from __future__ import unicode_literals

from django.contrib.gis.db import models
from django.core.serializers import serialize
from django.core.files.uploadedfile import SimpleUploadedFile

from PIL import Image
import os

class Well(models.Model):
    
    TYPE_CHOICES = (
    )

    wi_wellid = models.CharField(max_length=20)
    driller = models.CharField(max_length=100)
    drill_log = models.OneToOneField('DrillLog',null=True, blank=True, related_name='drill_log', on_delete=models.CASCADE)
    sample = models.ForeignKey('Sample',null=True,blank=True,on_delete=models.CASCADE)
    geom = models.PointField(null=True)
    carbonate = models.NullBooleanField()
    karstic = models.NullBooleanField()

    objects = models.GeoManager()
    
    def __str__(self):
        return str(self.wi_wellid)
        
    # def as_json(self,centroid=False):
    #     '''CURRENTLY NOT IN USE 3/7/17'''
    #     """returns a feature dictionary that can be added to a FeatureCollection"""

    #     jdict = {
    #         'geometry': {
    #             'type':"Polygon",
    #             'coordinates':self.geom.coords
    #         },
    #         'type': "Feature",
    #         'properties': {
    #             'stairid': self.stairid,
    #             'name': self.name,
    #             'type': self.type,
    #             'coords_x': self.coords_x,
    #             'coords_y': self.coords_y
    #         }
    #     }
        
    #     return jdict
        
    def save(self, *args, **kwargs):
        self.coords_x = self.geom.centroid.coords[0]
        self.coords_y = self.geom.centroid.coords[1]
        super(Stair, self).save(*args, **kwargs)
        
class Sink(models.Model):

    depth = ''
    
class DrillLog(models.Model):
    pass
    
class Sample(models.Model):

    SAMPLE_TYPES = (
        ('BACTERIA','bacteria'),
        ('INORGANIC','inorganic'),
        ('NITRATES','nitrates'),
        ('PESTICIDES','pesticides'),
        ('VOC','voc')
    )
    
    wi_wellid = models.CharField(max_length=20)
    date = models.DateField()
    time = models.IntegerField()
    receipt_date = models.DateField()
    report_date = models.DateField()
    type = models.CharField(max_length=20,choices=SAMPLE_TYPES)
    lab_id = models.CharField(max_length=20)
    sample_id = models.CharField(max_length=20)
    collect_name = models.CharField(max_length=100)
    collect_method = models.CharField(max_length=100)
    collect_agency = models.CharField(max_length=100)
    other_comments = models.CharField(max_length=255)
    lab_comments = models.CharField(max_length=255)
    sp_code = models.IntegerField()
    sp_desc = models.CharField(max_length=100)
    rq_code = models.IntegerField()
    rq_desc = models.CharField(max_length=100)
    res_amount = models.FloatField()
    res_units = models.CharField(max_length=100)
    lod = models.CharField(max_length=100)
    loq = models.CharField(max_length=100)
    rep_limit = models.CharField(max_length=100)
    enf_standard = models.CharField(max_length=100)
    pal = models.CharField(max_length=100)