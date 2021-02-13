from django.forms import ModelForm
from cspkarst.models import Sink, Well

class SinkForm(ModelForm):
    class Meta:
        model = Sink
        # fields = ['sink_type','dem_check','img_check','evidence','comment']
        exclude = ['geom']
        help_texts = {
            'sink_type': 'Do your best!',
        }

class WellForm(ModelForm):
    class Meta:
        model = Well
        exclude = ['geom']
        help_texts = {
            'new-latlng-input': 'Do your best!',
        }
