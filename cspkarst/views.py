# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json
from datetime import datetime
from django.shortcuts import render
from django.http import JsonResponse, HttpResponseBadRequest
from django.core.serializers import serialize
from django.conf import settings
from django.views import View
from django.http import HttpResponseBadRequest

from cspkarst.models import Sink, Well, PointOfInterest

def well_update(request, well_id):
    """DEPRECATED: This view is not implemented anymore, but is retained as template for
    how the well updates can be managed in the future."""
    from .forms import SinkForm, WellForm
    try:
        instance = Well.objects.get(wi_unique_well_no=well_id)
    except:
        return JsonResponse({'error':'no well with this sink_id. (how did you even request this?)'},status=404)
    fields = [f.name for f in instance._meta.get_fields()]

    # if POST, iterate the form data and update relevant fields in the instance
    if request.method == 'POST':
        form = WellForm(request.POST)
        latlng = request.POST['latlng-string']
        coords = latlng.split(',')
        error_msg = "Value must be formatted like this (lat, long): 43.317060, -90.843201"
        if len(coords) == 2:
            try:
                lat = float(coords[0])
                long = float(coords[1])
                instance.geom.x = long
                instance.geom.y = lat
                instance.location_method = "Manual update"
                instance.geo_corrected = True
                instance.geo_corrected_by = request.user.username
                instance.geo_corrected_on = datetime.now()
                instance.save()
            except Exception as e:
                print(e)


    # if a GET prepopulate form with the data from the input sink_id
    else:
        form = WellForm(instance=instance)

    return render(request, 'well.html', {'form': form})

class Viewer(View):
    def get(self, request):

        sh_probable = Sink.objects.filter(sink_type="SINKHOLE",confidence="PROBABLE").count()
        sh_possible = Sink.objects.filter(sink_type="SINKHOLE",confidence="POSSIBLE").count()

        user = {"username": ""}
        if request.user:
            user["username"] = request.user.username

        pois = PointOfInterest.objects.all()
        pois_serialized = serialize('geojson', pois, geometry_field='geom')
        context = {
            "user": user,
            "mapbox_api_key": settings.MAPBOX_API_KEY,
            "pg_tileserv_url": settings.PG_TILESERV_URL,
            "titiler_url": settings.TITILER_URL,
            "sinkhole_counts": {
                "total": sh_probable+sh_possible,
                "possible": sh_possible,
                "probable": sh_probable,
            },
            'examples_geojson': pois_serialized,
            'environment': settings.ENVIRONMENT,
        }

        return render(request, "index.html", context={'SVELTE_PROPS': {'CONTEXT': context}})

class APIV1View(View):

    def get(self, request, record_type):

        query_params = {k:v[0] for k, v in dict(request.GET).items()}
        f = query_params.pop('format')
        if f != 'geojson':
            return HttpResponseBadRequest("<h1>Bad Request</h1><p>Incorrect url parameters, <code>format=geojson</code> must be present.</p>")

        valid_record_types = ['sinks', 'wells', 'pois']
        if not record_type in valid_record_types:
            return HttpResponseBadRequest(f"""
            <h1>Bad Request</h1>
            <p>Incorrect record type. Supported values are: {", ".join(['<code>'+i+'</code>' for i in valid_record_types])}</p>
            """)

        # set defaults. fields=None returns ALL fields
        geom_field = 'geom'
        get_fields = None

        # set model class as needed, and augment defaults if necessary
        if record_type == "sinks":
            model = Sink
            get_fields = () # empty tuple returns no fields
        elif record_type == "wells":
            model = Well
        elif record_type == "pois":
            model = PointOfInterest

        try:
            items = model.objects.filter(**query_params)
        except Exception as e:
            return HttpResponseBadRequest(f"<h1>Bad Request</h1><p>Database query error: <code>{e}</code></p>")

        serialized = serialize('geojson', items, geometry_field=geom_field, fields=get_fields)
        data = json.loads(serialized)
        return JsonResponse(data)