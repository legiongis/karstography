from django.conf import settings
    
def context(request):
    return {
        'mapbox_api_key': settings.MAPBOX_API_KEY,
        'static_url': settings.STATIC_URL,
        'root_url': settings.ROOT_URL
    }