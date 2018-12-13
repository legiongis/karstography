// ~~~~~~~~~~ define all layers first ~~~~~~~~~~~~~~~~~~~~ //
var legionows = "https://db.legiongis.com/geoserver/ows?";

var outdoors = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token='+mapbox_api_key,{maxNativeZoom:18,maxZoom:19})
outdoors.id = "outdoors";

var mapbox_osm = L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token='+mapbox_api_key,{maxNativeZoom:18,maxZoom:19});
mapbox_osm.id = 'mapbox_osm'

var mapbox_aerial = L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token='+mapbox_api_key,{maxNativeZoom:18,maxZoom:19});
mapbox_aerial.id = "mapbox_aerial";

var outdoors_labels = L.tileLayer('https://api.mapbox.com/styles/v1/legiongis/cjhjd3d030ofi2rmszflafhuu/tiles/256/{z}/{x}/{y}?access_token='+mapbox_api_key,{maxNativeZoom:18,maxZoom:19});
outdoors_labels.id = 'outdoors_labels'

var hillshade = L.tileLayer.wms(legionows, {
    layers: 'elevation:driftless_hillshade',
    format: 'image/png',
    transparent: true,
    attribution: "Hillshade derived from <a href='http://www.wisconsinview.org/' target='_blank'>WisconsinView</a> LiDAR",
    tiled: true,
    maxZoom:19,
});
hillshade.id = 'hillshade'

var tpi = L.tileLayer.wms(legionows, {
    layers: 'csp:Crawford_TPI_int16-3857_complete',
    format: 'image/png',
    transparent: true,
    attribution: "<a href='http://www.gdal.org/gdaldem.html#gdaldem_TPI' target='_blank'>TPI</a> derived from <a href='http://www.wisconsinview.org/'>WisconsinView</a> LiDAR",
    tiled: true,
    maxZoom:19,
});
tpi.id = 'tpi'

var usgs = L.tileLayer.wms(legionows, {
    layers: 'csp:drg_s_wi023_opt',
    format: 'image/png',
    transparent: true,
    attribution: "USGS Topo",
    tiled: true,
    maxZoom:19,
});
usgs.id = 'usgs'

var watersheds = L.tileLayer.wms(legionows, {
    layers: 'wi_ref:wi_watersheds',
    format: 'image/png',
    transparent: true,
    attribution: "<a href='http://dnr.wi.gov/topic/watersheds/' target='_blank'>Watershed Boundaries (WIDNR)</a>",
    tiled: true,
    maxZoom:19,
});
watersheds.id = 'watersheds'

var bedrock = L.tileLayer.wms(legionows, {
    layers: 'csp:Crawford_Depth_to_Bedrock',
    format: 'image/png',
    transparent: true,
    attribution: "<a href='https://websoilsurvey.sc.egov.usda.gov/App/HomePage.htm' target='_blank'>USGS Soil Survey</a>",
    tiled: true,
    maxZoom:19,
});
bedrock.id = 'bedrock'

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
wi_geology.id = 'wi_geology'
wi_geology.legendInfo = true;

var frac = L.tileLayer.wms(legionows, {
    layers: 'csp:fracture_lines',
    format: 'image/png',
    transparent: true,
    attribution: "Fracture Lines (CSP staff)",
    tiled: true,
    maxZoom:19,
});
frac.id = 'frac'

//this is the sink layer used for identification. it's transparent.
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
sinks.id = 'sinks';

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
sinks12.id = 'sinks12';
sinks12.legendInfo = true;
sinks12.refreshable = true;

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
sinks25.id = 'sinks25';
sinks25.legendInfo = true;
sinks25.refreshable = true;

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
sinks5.id = 'sinks5';
sinks5.legendInfo = true;
sinks5.refreshable = true;

var sinkholes = L.tileLayer.wms(legionows, {
    layers: 'csp:sinkholes',
    format: 'image/png',
    transparent: true,
    attribution: "LiDAR-Derived Sink Locations",
    maxZoom:19,
    tiled: 'false',
});
sinkholes.id = 'sinkholes';
sinkholes.legendInfo = true;
sinkholes.refreshable = true;

var sinkholes_heatmap = L.WMS.overlay(legionows, {
    'layers': 'csp:sinkholes',
    'styles': 'sink_heatmap',
    'format': 'image/png',
    'transparent': true,
});
sinkholes_heatmap.id = 'sinkholes_heatmap';

var qsections = L.tileLayer.wms(legionows, {
    layers: 'wi_ref:plss_qsections',
    format: 'image/png',
    transparent: true,
    tiled: true,
    maxZoom:19,
});
qsections.id = 'qsections';

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
sec_composite.id = 'sec_composite';

var townships = L.tileLayer.wms(legionows, {
    layers: 'wi_ref:plss_townships',
    format: 'image/png',
    transparent: true,
    tiled: true,
    maxZoom:19,
});
townships.id = 'townships';

// use the overlay class from leaflet.wms.js to make a non-tiled layer.
// necessary for better labeling apparently
var mcd = L.WMS.overlay(legionows, {
    'layers': 'wi_ref:cities_towns_and_villages',
    'format': 'image/png',
    'transparent': true,
    'CQL_FILTER': "cnty_name IN ('CRAWFORD','VERNON','IOWA','GRANT','RICHLAND','LAFAYETTE')"
});
mcd.options = {'attribution':"Minor Civil Divisions Fall 2017"};
mcd.id = 'mcd';

var counties = L.WMS.overlay(legionows, {
    'layers': 'wi_ref:wi_counties_nrcs_4269',
    'transparent': true,
    'format':'image/png',
    'CQL_FILTER': "countyname IN ('Crawford','Vernon','Iowa','Grant','Richland','Lafayette')",
    'styles':"counties_karstography"
});
counties.options = {'attribution':"Counties <a href='https://gdg.sc.egov.usda.gov/' target='_blank'>NRCS</a>"};
counties.id = 'counties';

var boundaries = L.layerGroup([mcd,counties]);
boundaries.id = 'boundaries';

// ~~~~~~~~~~ intantiate map and stuff ~~~~~~~~~~~~~~~~~~~~ //

var map = L.map('karstmap',{zoomControl:false}).setView([43.22219, -90.9201], 10);
var hash = new L.Hash(map);

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

sinkholes_heatmap.options.zIndex = 38;
sinkholes.setZIndex(39);

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

var sinkIdentifyLayer = new L.tileLayer.betterWms(legionows+Math.random()+"&", {
    layers: 'csp:cspkarst_sink',
    transparent: true,
    styles: 'sink_invisible_10pt_pt',
    format: 'image/png',
});

var getSinkForm = function (e) {
    $('.map-icon').remove();
    var getFeatureUrl = sinkIdentifyLayer.getFeatureInfoUrl(e.latlng,'application/json');

    $.ajax({
        url:getFeatureUrl,
        success: function (data){
            console.log(data)
            if (data.features.length == 0) {
                console.log("no sink here!");
                $("#panel-content").html('<div class="form-msg" style="text-align:center;margin-top:20px;"><p style="font-weight:900;font-size:20px;">no sink here...</p></div>')
                return
            }

            console.log(data.features);
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
    if (map.hasLayer(sinks) || map.hasLayer(sinkholes) || map.hasLayer(sinks12) || map.hasLayer(sinks25) || map.hasLayer(sinks5)) {
        console.log("getting sink");
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

// add initial layers to map
map.addLayer(outdoors);
map.addLayer(outdoors_labels);
map.addLayer(boundaries);
map.addLayer(sinkholes);
map.addLayer(sinkholes_heatmap);

var allLayersGrp = L.layerGroup();

var seeLegend = '&nbsp;&nbsp;<i class="fa fa-info-circle open-legend-btn" title="open legend for more info"></i>';
var refreshLayer = '&nbsp;&nbsp;<i class="fa fa-refresh refresh-layer-icon" title="refresh layer"></i>';

// special case to push the labels layer to allLayersGrp
allLayersGrp.addLayer(outdoors_labels);

// create layer group of basemap layers, and push all to html controls
var baseLayers = {
    "Open Street Map":outdoors,
    "Aerial Imagery":mapbox_aerial,
    "SW WI Hillshade":hillshade,
    "USGS Topo":usgs,
    "Topographic Position Index":tpi,
};

var baseLayersGrp = L.layerGroup();
for (var key in baseLayers) {
    if (baseLayers.hasOwnProperty(key)) {
        layer = baseLayers[key]
        
        allLayersGrp.addLayer(layer)
        baseLayersGrp.addLayer(layer);
        
        var elHtml = `
                <div class="col-xs-12 layer-column">
                    <label>
                        <div>
                            <input id="`+layer.id+`" type="radio" class="basemap-layer leaflet-control-layers-selector" name="leaflet-base-layers" checked="">
                            <span> `+key+`</span>
                        </div>
                    </label>
                </div>
                `
        div = document.getElementById( 'basemap-collection' );
        div.insertAdjacentHTML( 'beforeend', elHtml );
    }
}

// create layer group of civil layers, and push all to html controls
var civilLayers = {
    "Civil Boundaries":boundaries,
    "PLSS &frac14; Sections":qsections,
    "PLSS Sections":sec_composite,
    "PLSS Townships":townships,
};
var civilLayersGrp = L.layerGroup();
for (var key in civilLayers) {
    if (civilLayers.hasOwnProperty(key)) {
        layer = civilLayers[key]
        
        allLayersGrp.addLayer(layer)
        civilLayersGrp.addLayer(layer);
        
        var elHtml = `
                <div class="col-xs-12 layer-column">
                    <label>
                        <div>
                            <input id="`+layer.id+`" type="checkbox" class="overlay-layer leaflet-control-layers-selector" checked=""></input>
                            <span> `+key+`</span>
                        </div>
                    </label>
                    
                </div>
                `
        div = document.getElementById( 'civil-collection' );
        div.insertAdjacentHTML( 'beforeend', elHtml );
    }
}

// create layer group of natural layers, and push all to html controls
var naturalLayers = {
    "Carbonate Bedrock":wi_geology,
    "Depth to Bedrock":bedrock,
    "Watershed Boundaries":watersheds,
};
var naturalLayersGrp = L.layerGroup();
for (var key in naturalLayers) {
    if (naturalLayers.hasOwnProperty(key)) {
        layer = naturalLayers[key]
        allLayersGrp.addLayer(layer)
        naturalLayersGrp.addLayer(layer);
        if (!layer.legendInfo) { moreInfo = '' } else { moreInfo = seeLegend }
        if (!layer.refreshable) { refreshable = '' } else { refreshable = refreshLayer }
        var elHtml = `
                <div class="col-xs-12 layer-column">
                    <label>
                        <div>
                            <input id="`+layer.id+`" type="checkbox" class="overlay-layer leaflet-control-layers-selector" checked="">
                            <span> `+key+`</span>
                        </div>
                        
                    </label>
                    <div class="layer-extra-icons">
                        `+moreInfo+refreshable+`
                    </div>
                </div>
                `
        div = document.getElementById( 'natural-collection' );
        div.insertAdjacentHTML( 'beforeend', elHtml );
        
    }
}

// create karst group of natural layers, and push all to html controls
var karstLayers = {
    "Sinks 1-2 ft":sinks12,
    "Sinks 2-5 ft":sinks25,
    "Sinks 5+ ft":sinks5,
    "Sinkholes Heatmap":sinkholes_heatmap,
    "Sinkholes":sinkholes,
    "Fracture Lines":frac,
};
var karstLayersGrp = L.layerGroup();
for (var key in karstLayers) {
    if (karstLayers.hasOwnProperty(key)) {
        layer = karstLayers[key]
        
        allLayersGrp.addLayer(layer)
        karstLayersGrp.addLayer(layer);
        if (!layer.legendInfo) { moreInfo = '' } else { moreInfo = seeLegend }
        if (!layer.refreshable) { refreshable = '' } else { refreshable = refreshLayer }
        var elHtml = `
                <div class="col-xs-12 layer-column">
                    <label>
                        <div>
                            <input id="`+layer.id+`" type="checkbox" class="overlay-layer leaflet-control-layers-selector" checked="">
                            <span> `+key+`</span>
                        </div>
                    </label>
                    <div class="layer-extra-icons">
                        `+moreInfo+refreshable+`
                    </div>
                </div>
                `
        div = document.getElementById( 'karst-collection' );
        div.insertAdjacentHTML( 'beforeend', elHtml );
    }
}

karstLayersGrp.eachLayer( function(layer) {
    console.log(layer);
});

// initial display of all enabled layers (radio buttons or checkboxes)
allLayersGrp.eachLayer(function(layer) {
    var lyrEl = $("#"+layer.id)
    if (map.hasLayer(layer)) {
        lyrEl.prop('checked', true);
    } else {
        lyrEl.prop('checked', false);
    }
});

// radio button layer visibility support for basemaps
$(".basemap-layer").click( function() {
    self = this;
    baseLayersGrp.eachLayer(function(layer) {
        if (layer.id === self.id) {
            map.addLayer(layer);
        } else {
            map.removeLayer(layer);
        }
    });
})

// basic on/off switch for overlays
$(".overlay-layer").click( function() {
    console.log("click");
    self = this;
    console.log(self.id);
    allLayersGrp.eachLayer(function(layer) {
        if (layer.id === self.id) {
            console.log(self.id);
            if (map.hasLayer(layer)) {
                console.log("removing");
                map.removeLayer(layer);
            } else {
                console.log("adding");
                map.addLayer(layer);
            }
        }
    });
})
