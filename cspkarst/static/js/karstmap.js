// ~~~~~~~~~~ intantiate map and stuff ~~~~~~~~~~~~~~~~~~~~ //
var map = L.map('karstmap',{zoomControl:false}).setView([43.22219, -90.9201], 10);
var hash = new L.Hash(map);

var c_zoom = new L.control.zoom({position:'topright'});
var c_fullscreen = new L.Control.Fullscreen({position:'bottomright'});
var c_gps = new L.Control.Gps({position:'topright'});
var c_scalebar = new L.control.scale();

// add all non-minimap controls here
map.addControl(c_zoom);
map.addControl(c_fullscreen);
// map.addControl(c_gps);
map.addControl(c_scalebar);

function redrawSinkLayer(){
    sinks12.setUrl("https://db.legiongis.com/geoserver/wms?"+Math.random()+"&");
    sinks12.redraw();
    sinks25.setUrl("https://db.legiongis.com/geoserver/wms?"+Math.random()+"&");
    sinks25.redraw();
    sinks5.setUrl("https://db.legiongis.com/geoserver/wms?"+Math.random()+"&");
    sinks5.redraw();
    sinkholes.setUrl("https://db.legiongis.com/geoserver/wms?"+Math.random()+"&");
    sinkholes.redraw();
}

var previous_latlng = [43.22219, -90.9201]
var previous_zoom = 10;
function saveView() {
    previous_latlng = map.getCenter();
    previous_zoom = map.getZoom();
}
function returnView() {
    map.flyTo(previous_latlng,previous_zoom);
}

function switchBaseLayer (layername) {
    for (var key in baseLayers) {
        if (baseLayers.hasOwnProperty(key)) {
            blayer = baseLayers[key];
            map.removeLayer(blayer);
            if (key == layername) {
                map.addLayer(blayer);
            }
        }
    }
}

function zoomToExample(latlng,zoom,baselayername) {
    switchBaseLayer(baselayername);
    map.flyTo(latlng,zoom);
}

var cleanGetFeatureUrl = function (url) {

    var xval = url.slice( url.indexOf('&X=') + 3, url.indexOf('&Y='));
    var yval = url.substring( url.indexOf('&Y=') + 3 );
    var xint = xval.split(".")[0]
    var yint = yval.split(".")[0]

    return url.replace('&X='+xval,'&X='+xint).replace('&Y='+yval,'&Y='+yint)
}

var getSinkForm = function (e) {
    $('.map-icon').remove();
    var getFeatureUrl = sinkIdentifyLayer.getFeatureInfoUrl(e.latlng,'application/json');
    var cleanedGetFeatureUrl = cleanGetFeatureUrl(getFeatureUrl)

    $.ajax({
        url:cleanedGetFeatureUrl,
        success: function (data){
            if (data.features.length == 0) {
                $("#panel-content").html('<div class="form-msg" style="text-align:center;margin-top:20px;"><p style="font-weight:900;font-size:20px;">no sink here...</p></div>')
                return
            }

            // check to make sure the clicked sink belongs to a layer that is currently visible
            var wrongLayer = false;
            $(data.features).each( function () {
                if (this.properties.sink_type == "SINKHOLE" && map.hasLayer(sinkholes)) {return}
                else if (this.properties.depth_cat == "1-2" && !map.hasLayer(sinks12)) {wrongLayer = true}
                else if (this.properties.depth_cat == "2-5" && !map.hasLayer(sinks25)) {wrongLayer = true}
                else if (this.properties.depth_cat == "5+" && !map.hasLayer(sinks5)) {wrongLayer = true}
            });
            if (wrongLayer == true) {return}

            var sink_id = data.features[0].properties['sink_id'];
            $.ajax({
                url : root_url+"/json/"+sink_id+"/",
                success : function (data) {
                    $('.map-icon').remove();
                    var marker_coords = [data.lat,data.lng]

                    var icon = L.divIcon({className: 'map-icon',html:'<i class="fa fa-arrow-left" style="font-size:20px;"></i>'});

                    $(".map-icon").html('');
                    $(".map-icon").css('cursor', 'default');
                    marker = new L.marker(marker_coords, {icon: icon}).addTo(map);

                },
                error:function (xhr, ajaxOptions, thrownError){
                    if(xhr.status==404) {
                        console.log(thrownError);
                    }
                }
            });
            $.ajax({
                url : root_url+"/sink-update/"+sink_id+"/",
                success : function (response) {
                    $("#info-panel").fadeIn();
                    $("#panel-content").html(response);
                    $("#sink-form").submit(function(event) {

                        // Stop form from submitting normally to avoid a redirect
                        event.preventDefault();
                        $.ajax({
                            url:root_url+'/sink-update/'+sink_id+'/',
                            type:'post',
                            data:$('#sink-form').serialize(),
                            success:function(){
                                redrawSinkLayer();
                                $("#panel-content").html('<div class="form-msg" style="text-align:center;margin-top:20px;"><i class="fa fa-check" style="font-size:40px;"></i><p style="font-weight:900;font-size:20px;">saved</p></div>');
                                $('.map-icon').remove();
                            }
                        });
                    });
                },
                error:function (xhr, ajaxOptions, thrownError){
                    if(xhr.status==404) {
                        console.log(thrownError);
                    }
                }
            });
        }
    });
}

map.on('click', function (e) {

    // return early if there is no user_name, meaning the user isn't logged in
    if (user_name == "") {return}

    if (map.hasLayer(sinkholes) || map.hasLayer(sinks12) || map.hasLayer(sinks25) || map.hasLayer(sinks5)) {
        getSinkForm(e);
    }
});

// make popup that shows lat/long and zoom level on right-click event
var latlongpopup = L.popup({'className' : 'latlong-popup'});
map.on("contextmenu", function (event) {
    var latitude = event.latlng.lat.toFixed(4);
    var longitude = event.latlng.lng.toFixed(4);
    var gm = 'http://maps.google.com/maps?z=7&t=k&q=loc:'+latitude+'+'+longitude;
    var gmlink = '<br><a href="'+gm+'" target="_blank">view in google maps</a>'
    latlongpopup
        .setLatLng(event.latlng)
        .setContent(latitude+', '+longitude+'<br>zoom level: '+map.getZoom()+gmlink)
        .openOn(map);
});

// add initial layers to map
map.addLayer(hillshade);
map.addLayer(outdoors_labels);
map.addLayer(civil_boundaries);
map.addLayer(sinkholes);
map.addLayer(sinkholes_heatmap);

// initial display of all enabled layers (radio buttons or checkboxes)
$.each(allLayersArray, function(index, layer) {
  var lyrEl = $("#"+layer.id)
  if (map.hasLayer(layer)) {
      lyrEl.prop('checked', true);
  } else {
      lyrEl.prop('checked', false);
  }
});
// allLayersGrp.eachLayer(function(layer) {
//     var lyrEl = $("#"+layer.id)
//     if (map.hasLayer(layer)) {
//         lyrEl.prop('checked', true);
//     } else {
//         lyrEl.prop('checked', false);
//     }
// });
