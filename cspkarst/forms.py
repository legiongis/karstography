from django.forms import ModelForm
from cspkarst.models import Sink

class SinkForm(ModelForm):
    class Meta:
        model = Sink
        fields = ['type','dem_check','img_check','evidence','comment','in_nfhl']
        
