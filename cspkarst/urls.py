from django.urls import path
from cspkarst.views import Viewer, APIV1View

urlpatterns = [
    path('', Viewer.as_view(), name='index'),
    path('api/v1/<str:record_type>', APIV1View.as_view(), name='api-v1'),
]
