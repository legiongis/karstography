# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponseRedirect,JsonResponse,HttpResponse
from django.core import serializers
from django.conf import settings
from .models import Sink
from .forms import SinkForm
import os
import json

def index(request):
    return render(request, 'index.html')
    
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
            for k, v in request.POST.iteritems():
                print k, v
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
    
def get_example_locations(request):
    examples_file = os.path.join(settings.BASE_DIR,'cspkarst','fixtures','example-locations.json')
    json_data = open(examples_file).read()
    data = json.loads(json_data)
    return JsonResponse(data)
