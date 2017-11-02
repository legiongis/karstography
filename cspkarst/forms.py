from django.forms import ModelForm
from cspkarst.models import Sink

class SinkForm(ModelForm):
    class Meta:
        model = Sink
        fields = ['sink_type','dem_check','img_check','evidence','comment']
        help_texts = {
            'sink_type': 'Do your best!',
        }
