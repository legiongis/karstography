from django.contrib.gis import admin

from reference_layers.models import (
    County,
    MinorCivilDivision,
    PLSSTownship,
    PLSSSection,
    PLSSQuarterSection,
)

admin.site.register(County)
admin.site.register(MinorCivilDivision)
admin.site.register(PLSSTownship)
admin.site.register(PLSSSection)
admin.site.register(PLSSQuarterSection)