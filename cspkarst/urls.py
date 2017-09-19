from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework import routers
from . import views

router = routers.DefaultRouter()

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^sink-update/(?P<sink_id>[\w-]+)/', views.sink_update, name='sink-update'),
    url(r'^', include(router.urls)),
    # url(r'^json/(?P<stairid>[\w-]+)/$', views.get_stairs, name='stair_json'),
]


