// ~~~~~~~~~~ define all layers first ~~~~~~~~~~~~~~~~~~~~ //
var legionows = "https://db.legiongis.com/geoserver/ows?";

var outdoors = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token='+mapbox_api_key,{maxNativeZoom:18,maxZoom:19})
var mapbox_osm = L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token='+mapbox_api_key,{maxNativeZoom:18,maxZoom:19});
var mapbox_aerial = L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token='+mapbox_api_key,{maxNativeZoom:18,maxZoom:19});
var outdoors_labels = L.tileLayer('https://api.mapbox.com/styles/v1/legiongis/cjhjd3d030ofi2rmszflafhuu/tiles/256/{z}/{x}/{y}?access_token='+mapbox_api_key,{maxNativeZoom:18,maxZoom:19});

var hillshade = L.tileLayer.wms(legionows, {
    layers: 'elevation:driftless_hillshade',
    format: 'image/png',
    transparent: true,
    attribution: "Hillshade derived from <a href='http://www.wisconsinview.org/' target='_blank'>WisconsinView</a> LiDAR",
    tiled: true,
    maxZoom:19,
});

var tpi = L.tileLayer.wms(legionows, {
    layers: 'csp:Crawford_TPI_int16-3857_complete',
    format: 'image/png',
    transparent: true,
    attribution: "<a href='http://www.gdal.org/gdaldem.html#gdaldem_TPI' target='_blank'>TPI</a> derived from <a href='http://www.wisconsinview.org/'>WisconsinView</a> LiDAR",
    tiled: true,
    maxZoom:19,
});

var usgs = L.tileLayer.wms(legionows, {
    layers: 'csp:drg_s_wi023_opt',
    format: 'image/png',
    transparent: true,
    attribution: "USGS Topo",
    tiled: true,
    maxZoom:19,
});

var watersheds = L.tileLayer.wms(legionows, {
    layers: 'wi_ref:wi_watersheds',
    format: 'image/png',
    transparent: true,
    attribution: "<a href='http://dnr.wi.gov/topic/watersheds/' target='_blank'>Watershed Boundaries (WIDNR)</a>",
    tiled: true,
    maxZoom:19,
});

var bedrock = L.tileLayer.wms(legionows, {
    layers: 'csp:Crawford_Depth_to_Bedrock',
    format: 'image/png',
    transparent: true,
    attribution: "<a href='https://websoilsurvey.sc.egov.usda.gov/App/HomePage.htm' target='_blank'>USGS Soil Survey</a>",
    tiled: true,
    maxZoom:19,
});

var wi_geology = L.tileLayer.wms(legionows, {
    layers: 'wi_ref:geology_a_wi_usgs_2005',
    format: 'image/png',
    transparent: true,
    attribution: "<a href='https://mrdata.usgs.gov/geology/state/state.php?state=WI' target='_blank'>USGS Geologic Map, WI</a>",
    tiled: true,
    opacity:0.75,
    styles:'CarbonateBedrock-statewide',
    maxZoom:19,
});

var frac = L.tileLayer.wms(legionows, {
    layers: 'csp:fracture_lines',
    format: 'image/png',
    transparent: true,
    attribution: "Fracture Lines (CSP staff)",
    tiled: true,
    maxZoom:19,
});

var sinks = L.tileLayer.wms(legionows, {
    layers: 'csp:cspkarst_sink',
    format: 'image/png',
    transparent: true,
    attribution: "LiDAR-Derived Sink Locations",
    styles: 'sink_evaluation_2.0',
    maxZoom:19,
    CQL_FILTER: "in_nfhl = false AND in_row = false",
    tiled: 'false',
});

var sinks12 = L.tileLayer.wms(legionows, {
    layers: 'csp:cspkarst_sink_12',
    format: 'image/png',
    transparent: true,
    attribution: "LiDAR-Derived Sink Locations",
    maxZoom:19,
    CQL_FILTER: "in_nfhl = false AND in_row = false",
    tiled: 'false',
    env: 'size:6',
});

var sinks25 = L.tileLayer.wms(legionows, {
    layers: 'csp:cspkarst_sink_25',
    format: 'image/png',
    transparent: true,
    attribution: "LiDAR-Derived Sink Locations",
    maxZoom:19,
    CQL_FILTER: "in_nfhl = false AND in_row = false",
    tiled: 'false',
    env: 'size:7',
});

var sinks5 = L.tileLayer.wms(legionows, {
    layers: 'csp:cspkarst_sink_5',
    format: 'image/png',
    transparent: true,
    attribution: "LiDAR-Derived Sink Locations",
    maxZoom:19,
    CQL_FILTER: "in_nfhl = false AND in_row = false",
    tiled: 'false',
    env: 'size:8',
});

var sinkholes = L.tileLayer.wms(legionows, {
    layers: 'csp:sinkholes',
    format: 'image/png',
    transparent: true,
    attribution: "LiDAR-Derived Sink Locations",
    maxZoom:19,
    tiled: 'false',
});

var sinkholes_heatmap = L.WMS.overlay(legionows, {
    'layers': 'csp:sinkholes',
    'styles': 'sink_heatmap',
    'format': 'image/png',
    'transparent': true,
});

var crawhillshade = L.tileLayer.wms('http://52.43.72.30:8080/geoserver/wms?'+Math.random(), {
    layers: 'work:Lafayette_Hillshade-3857',
    format: 'image/png',
    transparent: true,
    attribution: "Hillshade derived from WisconsinView LiDAR",
    tiled: true,
    maxZoom:19,
});

// experimenting with new PLSS layers
// var qqsections = L.tileLayer.wms(legionows, {
    // layers: 'wi_ref:plss_qqsections_sw_wi',
    // format: 'image/png',
    // transparent: true,
    // tiled: true,
    // maxZoom:19,
// });
var qsections = L.tileLayer.wms(legionows, {
    layers: 'wi_ref:plss_qsections',
    format: 'image/png',
    transparent: true,
    tiled: true,
    maxZoom:19,
});

var sections = L.WMS.overlay(legionows, {
    'layers': 'wi_ref:plss_sections',
    'format': 'image/png',
    'transparent': true,
    // 'CQL_FILTER': "cnty_name IN ('CRAWFORD','VERNON','IOWA','GRANT','RICHLAND','LAFAYETTE')"
});
var sectionsappend = L.WMS.overlay(legionows, {
    'layers': 'wi_ref:plss_sections_toappend',
    'format': 'image/png',
    'transparent': true,
    // 'CQL_FILTER': "cnty_name IN ('CRAWFORD','VERNON','IOWA','GRANT','RICHLAND','LAFAYETTE')"
});

var sec_composite = L.layerGroup([sections,sectionsappend]);
var townships = L.tileLayer.wms(legionows, {
    layers: 'wi_ref:plss_townships',
    format: 'image/png',
    transparent: true,
    tiled: true,
    maxZoom:19,
});

// use the overlay class from leaflet.wms.js to make a non-tiled layer.
// necessary for better labeling apparently
var mcd = L.WMS.overlay(legionows, {
    'layers': 'wi_ref:cities_towns_and_villages',
    'format': 'image/png',
    'transparent': true,
    'CQL_FILTER': "cnty_name IN ('CRAWFORD','VERNON','IOWA','GRANT','RICHLAND','LAFAYETTE')"
});
mcd.options = {'attribution':"Minor Civil Divisions Fall 2017"};

var counties = L.WMS.overlay(legionows, {
    'layers': 'wi_ref:wi_counties_nrcs_4269',
    'transparent': true,
    'format':'image/png',
    'CQL_FILTER': "countyname IN ('Crawford','Vernon','Iowa','Grant','Richland','Lafayette')",
    'styles':"counties_karstography"
});
counties.options = {'attribution':"Counties <a href='https://gdg.sc.egov.usda.gov/' target='_blank'>NRCS</a>"};

var boundaries = L.layerGroup([mcd,counties]);

// ~~~~~~~~~~ intantiate map and stuff ~~~~~~~~~~~~~~~~~~~~ //

var map = L.map('karstmap',{zoomControl:false}).setView([43.22219, -90.9201], 10);

// add the minimap right away
// 7-27-18: removing minimap as per CSP request
// var osm_minimap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token='+mapbox_api_key,{maxNativeZoom:18,maxZoom:19});
// var c_minimap = new L.Control.MiniMap(osm_minimap,{toggleDisplay:true,minimized:true});map.addControl(c_minimap);

// explicitly set all of the layer zindex values. this is necessary because
// the auto z-indexing doesn't seem to work on the L.WMS.overlay layers
outdoors.setZIndex(1);
mapbox_aerial.setZIndex(2);
hillshade.setZIndex(3);
usgs.setZIndex(4);
tpi.setZIndex(5);

outdoors_labels.setZIndex(20)
wi_geology.setZIndex(21);
bedrock.setZIndex(22);
qsections.setZIndex(23);
sections.options['zIndex'] = 24;
sectionsappend.options['zIndex'] = 25;
mcd.options['zIndex'] = 26;
counties.options['zIndex'] = 27;
watersheds.setZIndex(28);
frac.setZIndex(29);
townships.setZIndex(30);
sinks.setZIndex(31);
sinks12.setZIndex(32);
sinks25.setZIndex(33);
sinks5.setZIndex(34);

sinkholes_heatmap.options['zIndex'] = 38;
sinkholes.setZIndex(39);

var c_layers = new L.control.layers(baseLayers, overlayLayers,{position:'topright',collapsed:false,autoZIndex:false});
var c_zoom = new L.control.zoom({position:'topright'});
var c_fullscreen = new L.Control.Fullscreen({position:'bottomright'});
var c_gps = new L.Control.Gps({position:'topright'});

// add all non-minimap controls here
map.addControl(c_layers);
map.addControl(c_zoom);
map.addControl(c_fullscreen);
// map.addControl(c_gps);

// Call the getContainer routine.
var htmlObject = c_layers.getContainer();
// Get the desired parent node.
var a = document.getElementById('put-layers-here');

// Finally append that node to the new parent, recursively searching out and re-parenting nodes.
function setParent(el, newParent) {
    newParent.appendChild(el);
}
setParent(htmlObject, a);


function redrawSinkLayer(){
    // sinks.setUrl("https://db.legiongis.com/geoserver/wms?"+Math.random()+"&");
    // sinks.redraw();
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


// function used at one point to generate a rectangle from a point's bbox
// not in use
// var make_square_from_pt_bbox = function (bbox) {
    // var southwest = [bbox[1]-.0000,bbox[0]-.0000];
    // var northeast = [bbox[3]+.0000,bbox[2]+.0000];
    // return [southwest,northeast]
// }

var sinkIdentifyLayer = new L.tileLayer.betterWms(legionows+Math.random()+"&", {
    layers: 'csp:cspkarst_sink',
    transparent: true,
    format: 'image/png',
});
// var marker;
var getSinkForm = function (e) {
    $('.map-icon').remove();
    var getFeatureUrl = sinkIdentifyLayer.getFeatureInfoUrl(e.latlng,'application/json');
    // console.log(getFeatureUrl);
    // var url = new URL(getFeatureUrl);
    // console.log(url);
    // var c = url.searchParams.get("BBOX");
    // var bounds = make_square_from_pt_bbox(c.split(","));
    // console.log(bounds);
    
    // marker = new L.rectangle(bounds, {
        // color: 'red',
        // fillColor: '#f03',
        // fillOpacity: 0,
        // weight:0.5,
        // zindex:100,
    // }).addTo(map);
    $.ajax({
        url:getFeatureUrl,
        success: function (data){
            console.log(data)
            if (data.features.length == 0) {
                console.log("no sink here!");
                $("#panel-content").html('<div class="form-msg" style="text-align:center;margin-top:20px;"><p style="font-weight:900;font-size:20px;">no sink here...</p></div>')
                return
            }
            
            //// trying many different ways to add a marker of some sort to the selected sink
            //// ultimately the problem is that coordinates returned by GetFeatureInfo do not
            //// seem to be the same as the displayed coordinates of the feature itself. So
            //// using those to create a new feature makes things look weird.
            //// also tried using a WFS request to get the sink id and coords, but ran into
            //// different problems with that... See the bottom of this script.
            // coords = data.features[0].geometry['coordinates']
            // marker = new L.circle([coords[1],coords[0]], {
                // color: 'red',
                // fillOpacity: 0,
                // weight:0.5,
                // radius: 12
            // }).addTo(map);
            // L.MakiMarkers.accessToken = mapbox_api_key;
            // var icon = L.MakiMarkers.icon({icon:'hospital', color: "#e3e311", size: "s"});
            // var icon = L.divIcon({className: 'map-icon',html:'<i class="fa fa-edit" style="font-size:20px;"></i>'});
            // var icon = L.divIcon({className: 'map-icon',html:'<p><strong>*</strong></p>'});
            // $(".map-icon").html('');
            // marker = new L.marker([coords[1],coords[0]], {icon: icon}).addTo(map);
            // console.log(data.features[0].geometry['coordinates']);
            // var bounds = make_square_from_pt_bbox(data.features[0].properties['bbox']);
            // console.log(bounds);
            
            console.log(data.features);
            var sink_id = data.features[0].properties['sink_id'];
            $.ajax({
                url : root_url+"/json/"+sink_id+"/",
                success : function (data) {
                    $('.map-icon').remove();
                    var marker_coords = [data.lat,data.lng]
                    // var icon = L.divIcon({className: 'map-icon',html:'<i class="fa fa-edit" style="font-size:20px;"></i>'});
                    var icon = L.divIcon({className: 'map-icon',html:'<i class="fa fa-arrow-left" style="font-size:20px;"></i>'});
                    // var icon = L.divIcon({className: '',html:'<div style="height:1px;width:1px;background-color:black;"></div>'});
                    // L.MakiMarkers.accessToken = mapbox_api_key;
                    // var icon = L.MakiMarkers.icon({icon:'hospital', color: "#e3e311", size: "s"});
                    $(".map-icon").html('');
                    marker = new L.marker(marker_coords, {icon: icon}).addTo(map);
                    // marker = new L.circle(marker_coords, {
                        // color: 'red',
                        // fillOpacity: 0,
                        // weight:0.5,
                        // radius: 12
                    // }).addTo(map);
                },
                error:function (xhr, ajaxOptions, thrownError){
                    console.log("error ianefin");
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
    // if (marker) {
        // map.removeLayer(marker);
    // }
    console.log(map.hasLayer(sinks));
    console.log(map.hasLayer(sinkholes));
    console.log(map.hasLayer(sinks12));
    console.log(map.hasLayer(sinks25));
    console.log(map.hasLayer(sinks5));
    if (map.hasLayer(sinks) || map.hasLayer(sinkholes) || map.hasLayer(sinks12) || map.hasLayer(sinks25) || map.hasLayer(sinks5)) {
        console.log("should be getting sink")
        getSinkForm(e);
    }
});

// force the redraw of the sinks layer so that if its data has been changed, the symbology
// will be updated right away. this layer should have tile-caching set to false so
// that it won't be using geowebcache. only enabled if a user in logged in (editing).
map.on('mousedown', function (){
});

// make popup that shows lat/long and zoom level on right-click event
var latlongpopup = L.popup({'className' : 'latlong-popup'});
map.on("contextmenu", function (event) {
    var latitude = event.latlng.lat.toFixed(4);
    var longitude = event.latlng.lng.toFixed(4);
    var gm = 'http://maps.google.com/maps?z=7&t=k&q=loc:'+latitude+'+'+longitude;
    var gmlink = '<br><a href="'+gm+'" target="_blank">google maps</a>'
    latlongpopup
        .setLatLng(event.latlng)
        .setContent(latitude+', '+longitude+'<br>zoom level: '+map.getZoom()+gmlink)
        .openOn(map);
});

//// This is working example of using a WFS request instead of WFS GetFeatureInfo request
//// However, it seems that the Distance property units are based on the EPSG of the 
//// data that is being queried, regardless of what unit is specified in the call.
//// So, putting this on hold for a bit...
// map.on("click", function(e){
    // var point = L.Projection.Mercator.project(e.latlng)
    // var wfsreq = "<Filter xmlns:gml='http://www.opengis.net/gml'>" +
        // "<DWithin>" +
          // "<PropertyName>geom</PropertyName>" +
          // "<gml:Point srsName='http://www.opengis.net/gml/srs/epsg.xml#3857'>" +
            // "<gml:coordinates>"+point['x']+","+point['y']+"</gml:coordinates>" +
          // "</gml:Point>" +
          // "<Distance units='meters'>1</Distance>" +
        // "</DWithin>" +
      // "</Filter>";
    // var wfs = "https://db.legiongis.com/geoserver/wfs?request=getfeature&version=1.0.0&service=wfs&typename=csp:cspkarst_sink&propertyname=geom&outputformat=json&filter="+encodeURIComponent(wfsreq);
    // console.log(wfs);
    // $.ajax({
        // url:wfs,
        // success: function (data){
            // console.log(data)
        // },
        // error:function (xhr, ajaxOptions, thrownError){
            // if(xhr.status==404) {
                // console.log(thrownError);
            // }
        // }
    // });
// });

