from django.contrib.gis.db import models

class County(models.Model):

    fips = models.IntegerField()
    name = models.CharField(max_length=50,blank=True,null=True)
    state_name = models.CharField(max_length=50,blank=True,null=True)
    geom = models.MultiPolygonField(null=True)

    def __str__(self):
        return self.name

class MinorCivilDivision(models.Model):

    CTV_CHOICES = (
       ("C","City"),
       ("T","Town"),
       ("V","Village"),
    )

    geoid = models.BigIntegerField()
    county = models.ForeignKey(County, models.SET_NULL, null=True, blank=True)
    ctv = models.CharField(max_length=1,choices=CTV_CHOICES)
    name = models.CharField(max_length=50,blank=True,null=True)
    geom = models.MultiPolygonField(null=True)

    def __str__(self):
        return self.name

class PLSSTownship(models.Model):

    dir = models.IntegerField()
    twp = models.IntegerField()
    rng = models.IntegerField()
    geom = models.MultiPolygonField(null=True)

    def __str__(self):
        return f"D{self.d} T{self.t} R{self.r}"

class PLSSSection(models.Model):

    township = models.ForeignKey(PLSSTownship, models.SET_NULL, null=True, blank=True)
    dir = models.IntegerField()
    twp = models.IntegerField()
    rng = models.IntegerField()
    sec = models.IntegerField()
    geom = models.MultiPolygonField(null=True)

    def __str__(self):
        return str(self.s)

class PLSSQuarterSection(models.Model):

    section = models.ForeignKey(PLSSSection, models.SET_NULL, null=True, blank=True)
    dir = models.IntegerField()
    twp = models.IntegerField()
    rng = models.IntegerField()
    sec = models.IntegerField()
    qsec = models.IntegerField()
    geom = models.MultiPolygonField(null=True)

    def __str__(self):
        return str(self.q)
