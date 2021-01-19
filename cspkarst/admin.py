# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from .models import Sink, TownUnit, Well, PointOfInterest

admin.site.register(Sink)
admin.site.register(TownUnit)
admin.site.register(Well)
admin.site.register(PointOfInterest)
