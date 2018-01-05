from django.conf import settings
from cspkarst.models import Sink
    
def context(request):
    return {
        'mapbox_api_key': settings.MAPBOX_API_KEY,
        'static_url': settings.STATIC_URL,
        'root_url': settings.ROOT_URL
    }
    
def sink_counts(request):
    sh_probable = len(Sink.objects.filter(sink_type="SINKHOLE",confidence="PROBABLE"))
    sh_possible = len(Sink.objects.filter(sink_type="SINKHOLE",confidence="POSSIBLE"))
    return {
        'sinkhole_total': sh_probable+sh_possible,
        'sinkhole_probable': sh_probable,
        'sinkhole_possible': sh_possible
    }