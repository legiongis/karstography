from django.conf import settings
from cspkarst.models import Sink

def context(request):
    if settings.ENVIRONMENT == "staging":
        env_suffix = "-stage"
    elif settings.ENVIRONMENT == "production":
        env_suffix = "-prod"
    else:
        env_suffix = ""

    return {
        'mapbox_api_key': settings.MAPBOX_API_KEY,
        'static_url': settings.STATIC_URL,
        'root_url': settings.ROOT_URL,
        'user_is_staff': request.user.is_staff,
        'env_suffix': env_suffix,
    }

def sink_counts(request):
    sh_probable = len(Sink.objects.filter(sink_type="SINKHOLE",confidence="PROBABLE"))
    sh_possible = len(Sink.objects.filter(sink_type="SINKHOLE",confidence="POSSIBLE"))
    return {
        'sinkhole_total': sh_probable+sh_possible,
        'sinkhole_probable': sh_probable,
        'sinkhole_possible': sh_possible
    }
