from django.conf.urls import url, include
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^json/(?P<sink_id>[\w-]+)/', views.sink_info, name='sink-info'),
    url(r'^sink-update/(?P<sink_id>[\w-]+)/', views.sink_update, name='sink-update'),
    url(r'^example-locations/', views.get_example_locations, name='example-locations'),
    url(r'^wells/', views.wells_geojson, name='wells-geojson'),
    url(r'^well-update/(?P<well_id>[\w-]+)/', views.well_update, name='well-update'),
    # url(r'^json/(?P<stairid>[\w-]+)/$', views.get_stairs, name='stair_json'),
]
