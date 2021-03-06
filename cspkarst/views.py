# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import os
import json
from datetime import datetime
from django.shortcuts import render
from django.http import HttpResponseRedirect,JsonResponse,HttpResponse
from django.core.serializers import serialize
from django.conf import settings
from django.core.exceptions import ValidationError
from django.views.decorators.clickjacking import xframe_options_exempt
from .models import Sink, Well, PointOfInterest
from .forms import SinkForm, WellForm


def index(request):
    return render(request, 'index.html')

@xframe_options_exempt
def simple_embed(request):
    return render(request, 'simple_embed.html')

def sink_update(request,sink_id):
    try:
        instance = Sink.objects.get(sink_id=sink_id)
    except:
        return JsonResponse({'error':'no sink with this sink_id. (how did you even request this?)'},status=404)
    fields = [f.name for f in instance._meta.get_fields()]

    # if POST, iterate the form data and update relevant fields in the instance
    if request.method == 'POST':
        form = SinkForm(request.POST)
        if form.is_valid():
            for k, v in request.POST.items():
                if k in fields:
                    if v == '':
                        v = None
                    if v == 'on':
                        v = True
                    setattr(instance, k, v)
            instance.save()

    # if a GET prepopulate form with the data from the input sink_id
    else:
        form = SinkForm(instance=instance)

    # form.fields['comment'].widget.attrs['readonly'] = True

    return render(request, 'sink.html', {'form': form})

def sink_info(request,sink_id):
    try:
        instance = Sink.objects.get(sink_id=sink_id)
    except:
        return JsonResponse({'error':'no sink with this sink_id.'},status=404)

    return JsonResponse({"lat":instance.geom[1],"lng":instance.geom.coords[0]})

def get_example_locations(request):

    data = serialize('geojson', PointOfInterest.objects.all(),
        geometry_field='geom')
    return JsonResponse(json.loads(data))

def wells_geojson(request):

    data = serialize('geojson', Well.objects.all(),
          geometry_field='geom')
    return JsonResponse(json.loads(data))

def well_update(request, well_id):
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

    # form.fields['comment'].widget.attrs['readonly'] = True

    return render(request, 'well.html', {'form': form})
