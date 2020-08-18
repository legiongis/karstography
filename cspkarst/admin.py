# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from leaflet.admin import LeafletGeoAdmin
from .models import Sink, TownUnit, Well, PointOfInterest

class StairAdmin(LeafletGeoAdmin):
    search_fields = ['type']
    ordering = ('sink_id',)

admin.site.register(Sink)
admin.site.register(TownUnit)
admin.site.register(Well)
admin.site.register(PointOfInterest)
