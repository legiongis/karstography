# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from .models import Sink, TownUnit, Well, PointOfInterest

class WellAdmin(admin.ModelAdmin):

    # make all the fields that come from the DNR db immutable in admin pages
    readonly_fields = (
        "wi_unique_well_no",
        "watr_seq_no",
        "dnr_lat_dd_amt",
        "dnr_long_dd_amt",
        "survey_township",
        "survey_range",
        "survey_range_dir",
        "survey_section",
        "q_section",
        "qq_section",
        "well_addr",
        "owner_mailing_addr",
        "esri_oid",
        "muni",
        "well_depth_amt",
        "well_depth_amt_text",
        "constructor_name",
        "well_complete_date",
        "well_status",
        "static_depth_amt",
        "static_depth_above_below",
        "location_method",
        "casing_depth_amt",
        "casing_depth_amt_txt",
        "decade_complete",
        "well_constr_url",
        "sample_db_url",
    )

admin.site.register(Sink)
admin.site.register(TownUnit)
admin.site.register(Well, WellAdmin)
admin.site.register(PointOfInterest)
