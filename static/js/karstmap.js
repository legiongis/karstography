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
        
var counties = L.tileLayer.wms(legionows, {
    layers: 'wi_ref:wi_counties_nrcs_4269',
    format: 'image/png',
    transparent: true,
    attribution: "",
    CQL_FILTER: "countyname IN ('Crawford','Vernon','Iowa','Grant','Richland','Lafayette')"
})

var hillshade = L.tileLayer.wms(legionows, {
    layers: 'elevation:driftless_hillshade',
    format: 'image/png',
    transparent: true,
    attribution: "Hillshade derived from WisconsinView LiDAR"
})
var watersheds = L.tileLayer.wms(legionows, {
    layers: 'wi_ref:wi_watersheds',
    format: 'image/png',
    transparent: true,
    attribution: "HUC boundaries from WIDNR"
})
var bedrock = L.tileLayer.wms(legionows, {
    layers: 'csp:Crawford_Depth_to_Bedrock',
    format: 'image/png',
    transparent: true,
    attribution: "HUC boundaries from WIDNR"
})
var frac = L.tileLayer.wms(legionows, {
    layers: 'csp:fracture_lines',
    format: 'image/png',
    transparent: true,
    attribution: "HUC boundaries from WIDNR"
})
var sinks = L.tileLayer.wms(legionows, {
    layers: 'csp:sinkholes_0817',
    format: 'image/png',
    transparent: true,
    attribution: "LiDAR-Derived Sink Locations",
    styles: 'sink_depth',
    maxNativeZoom:18,
    maxZoom:19,
    CQL_FILTER: "nfhl_flag <> 1 AND row_flag <> 1"
})

var sinkIdentifyLayer = new L.tileLayer.betterWms(legionows+Math.random()+"&", {
    layers: 'csp:sinkholes_0817',
    transparent: true,
    format: 'image/png',
    tiled: 'false',
});


// ~~~~~~~~~~ intantiate map and stuff ~~~~~~~~~~~~~~~~~~~~ //

var map = L.map('karstmap',{zoomControl:false}).setView([43.22219, -90.9201], 10);

// add the minimap right away
var osm_minimap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token='+mapbox_api_key,{maxNativeZoom:18,maxZoom:19});
var c_minimap = new L.Control.MiniMap(osm_minimap,{toggleDisplay:true,minimized:true});map.addControl(c_minimap);

// create all layers


  
map.addLayer(outdoors);
map.addLayer(counties);

var baseLayers = {
    "Open Street Map": outdoors,
    "Aerial Imagery": esri_aerial
};


var overlaysDict = {
    "SW WI Hillshade":hillshade,
    "Crawford Co Bedrock":bedrock,
    "Watersheds":watersheds,
    "Fracture Lines":frac,
    "Sinkholes (sized by depth)":sinks,
    "County Boundaries":counties,
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


//###################### following section is for wfs posting
// get feature service operation
var owsrootUrl = legionows;

var defaultParameters = {
    service : 'WFS',
    version : '2.0',
    request : 'GetFeature',
    typeName : 'csp:sinkholes_0817',
    outputFormat : 'text/javascript',
    format_options : 'callback:getJson',
    SrsName : 'EPSG:4326'
};

var parameters = L.Util.extend(defaultParameters);
var URL = owsrootUrl + L.Util.getParamString(parameters);

var WFSLayer = null;
// var ajax = $.ajax({
    // url : URL,
    // dataType : 'jsonp',
    // jsonpCallback : 'getJson',
    // success : function (response) {
        // WFSLayer = L.geoJson(response, {
            // style: function (feature) {
                // return {
                    // stroke: false,
                    // fillColor: 'FFFFFF',
                    // fillOpacity: 0
                // };
            // },
            // onEachFeature: function (feature, layer) {
                // popupOptions = {maxWidth: 200};
                // layer.bindPopup("Popup text, access attributes with feature.properties.ATTRIBUTE_NAME"
                    // ,popupOptions);
            // }
        // }).addTo(map);
    // }
// });


getSinkId = function (e) {
    var getFeatureUrl = sinkIdentifyLayer.getFeatureInfoUrl(e.latlng,'application/json');
    $.ajax({
        url:getFeatureUrl,
        success: function (data){
            if (data.features.length == 0) {
                console.log("no sink here!");
                return
            }
            var sink_id = data.features[0].properties['sink_id'];
            $.ajax({
                url : "/sink-update/"+sink_id+"/",
                success : function (response) {
                    $("#panel-content").html(response);
                    $("#sink-form").submit(function(event) {
                    // Stop form from submitting normally to avoid a redirect
                    event.preventDefault();
                    $.ajax({
                        url:'/sink-update/'+sink_id+'/',
                        type:'post',
                        data:$('#sink-form').serialize(),
                        success:function(){
                            $('#sink-form').find(':input[type=submit]').attr('disabled', 'disabled');
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