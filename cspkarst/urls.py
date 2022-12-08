from django.urls import path
from django.conf.urls import url, include
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^simple-embed/', views.simple_embed, name='simple_embed'),
    url(r'^json/(?P<sink_id>[\w-]+)/', views.sink_info, name='sink-info'),
    url(r'^sink-update/(?P<sink_id>[\w-]+)/', views.sink_update, name='sink-update'),
    url(r'^example-locations/', views.get_example_locations, name='example-locations'),
    url(r'^wells/', views.wells_geojson, name='wells-geojson'),
    url(r'^well-update/(?P<well_id>[\w-]+)/', views.well_update, name='well-update'),
    # url(r'^json/(?P<stairid>[\w-]+)/$', views.get_stairs, name='stair_json'),
    url(r'^viewer/$', views.Viewer.as_view(), name="viewer"),
    # path('sinkholes/geojson', views.SinkholesGeoJSON.as_view(), name='sinkhole_geojson'),
    path('api/v1/<str:record_type>', views.APIV1View.as_view(), name='api-v1'),
]
