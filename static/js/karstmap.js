// ~~~~~~~~~~ define all layers first ~~~~~~~~~~~~~~~~~~~~ //
var legionows = "https://db.legiongis.com/geoserver/ows?";

var outdoors = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token='+mapbox_api_key,{maxNativeZoom:18,maxZoom:19})
var mapbox_osm = L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token='+mapbox_api_key,{maxNativeZoom:18,maxZoom:19});

mapLink = '<a href="http://www.esri.com/">Esri</a>';
wholink = 'i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
var esri_aerial = L.tileLayer(
    'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; '+mapLink+', '+wholink,
    maxZoom: 18,
});
        
// use the overlay class from leaflet.wms.js to make a non-tiled layer.
// necessary for better labeling apparently
var counties = L.WMS.overlay(legionows, {
    'layers': 'wi_ref:wi_counties_nrcs_4269',
    'transparent': true,
    'format':'image/png',
    'CQL_FILTER': "countyname IN ('Crawford','Vernon','Iowa','Grant','Richland','Lafayette')",
});

var mcd = L.WMS.overlay(legionows, {
    'layers': 'wi_ref:cities_towns_and_villages',
    'format': 'image/png',
    'transparent': true,
    'attribution': "Minor Civil Divisions, Fall 2017",
    'CQL_FILTER': "cnty_name IN ('CRAWFORD','VERNON','IOWA','GRANT','RICHLAND','LAFAYETTE')"
});

var boundaries = L.layerGroup([mcd,counties]);

var hillshade = L.tileLayer.wms(legionows, {
    layers: 'elevation:driftless_hillshade',
    format: 'image/png',
    transparent: true,
    attribution: "Hillshade derived from WisconsinView LiDAR",
    tiled: true,
});
var watersheds = L.tileLayer.wms(legionows, {
    layers: 'wi_ref:wi_watersheds',
    format: 'image/png',
    transparent: true,
    attribution: "HUC boundaries from WIDNR",
    tiled: true,
});

var bedrock = L.tileLayer.wms(legionows, {
    layers: 'csp:Crawford_Depth_to_Bedrock',
    format: 'image/png',
    transparent: true,
    attribution: "HUC boundaries from WIDNR",
    tiled: true,
});
var frac = L.tileLayer.wms(legionows, {
    layers: 'csp:fracture_lines',
    format: 'image/png',
    transparent: true,
    attribution: "HUC boundaries from WIDNR",
    tiled: true,
});
var sinks = L.tileLayer.wms(legionows, {
    layers: 'csp:cspkarst_sink',
    format: 'image/png',
    transparent: true,
    attribution: "LiDAR-Derived Sink Locations",
    styles: 'sink_evaluation_2.0',
    maxNativeZoom:18,
    maxZoom:19,
    CQL_FILTER: "in_nfhl <> true AND in_row <> true",
    tiled: 'false',
});

var sinkIdentifyLayer = new L.tileLayer.betterWms(legionows+Math.random()+"&", {
    layers: 'csp:cspkarst_sink',
    transparent: true,
    format: 'image/png',
});

var crawhillshade = L.tileLayer.wms('http://52.43.72.30:8080/geoserver/wms?'+Math.random(), {
    layers: 'work:Lafayette_Hillshade-3857',
    format: 'image/png',
    transparent: true,
    attribution: "Hillshade derived from WisconsinView LiDAR",
    tiled: true,
});


// ~~~~~~~~~~ intantiate map and stuff ~~~~~~~~~~~~~~~~~~~~ //

var map = L.map('karstmap',{zoomControl:false}).setView([43.22219, -90.9201], 10);

// add the minimap right away
var osm_minimap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token='+mapbox_api_key,{maxNativeZoom:18,maxZoom:19});
var c_minimap = new L.Control.MiniMap(osm_minimap,{toggleDisplay:true,minimized:true});map.addControl(c_minimap);

// create all layers

map.addLayer(outdoors);
map.addLayer(boundaries);

var baseLayers = {
    "Open Street Map": outdoors,
    "Aerial Imagery": esri_aerial
};

var overlaysDict = {
    "SW WI Hillshade":hillshade,
    "Crawford Co Bedrock":bedrock,
    "Boundaries":boundaries,
    "Watersheds":watersheds,
    "Fracture Lines":frac,
    "Sinkholes (sized by depth)":sinks,
};

var c_layers = new L.control.layers(baseLayers, overlaysDict,{position:'topright'});
var c_zoom = new L.control.zoom({position:'topright'});
var c_fullscreen = new L.Control.Fullscreen({position:'topright'});
var c_gps = new L.Control.Gps();

// add all non-minimap controls here
map.addControl(c_layers);
map.addControl(c_zoom);

map.addControl(c_fullscreen);
// map.addControl(c_gps);

getSinkId = function (e) {
    var getFeatureUrl = sinkIdentifyLayer.getFeatureInfoUrl(e.latlng,'application/json');
    $.ajax({
        url:getFeatureUrl,
        success: function (data){
            if (data.features.length == 0) {
                console.log("no sink here!");
                return
            }
            console.log(data.features);
            var sink_id = data.features[0].properties['sink_id'];
            $.ajax({
                url : root_url+"sink-update/"+sink_id+"/",
                success : function (response) {
                    $("#panel-content").html(response);
                    $("#sink-form").submit(function(event) {
                        // Stop form from submitting normally to avoid a redirect
                        event.preventDefault();
                        $.ajax({
                            url:root_url+'sink-update/'+sink_id+'/',
                            type:'post',
                            data:$('#sink-form').serialize(),
                            success:function(){
                                $("#panel-content").html('<div style="text-align:center;color:#182F4C;    margin-top:20px;"><i class="fa fa-check" style="font-size:40px;"></i><p style="font-weight:900;font-size:20px;">saved</p></div>');
                                
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

map.on('click', getSinkId);


// force the redraw of a layer so that if its data has been changed, the symbology
// will be updated right away. this layer should have tile-caching set to false so
// that it won't be using geowebcache. ultimately, this should only be enabled during
// editing mode
forceLayerRedraw = function (layer,map) {
    console.log()
    
}
map.on('mousedown', function (){
    if (map.hasLayer(sinks)) {
        sinks.setUrl("https://db.legiongis.com/geoserver/wms?"+Math.random()+"&");
        sinks.redraw();
    }
});

// make popup that shows lat/long on right-click event
var latlongpopup = L.popup({'className' : 'latlong-popup'});
map.on("contextmenu", function (event) {
    var latitude = event.latlng.lat.toFixed(4);
    var longitude = event.latlng.lng.toFixed(4);
    var gm = 'http://maps.google.com/maps?z=7&t=k&q=loc:'+latitude+'+'+longitude;
    var gmlink = '<br><a href="'+gm+'" target="_blank">view in google maps</a>'
    latlongpopup
        .setLatLng(event.latlng)
        .setContent(latitude+', '+longitude)
        .openOn(map);
});