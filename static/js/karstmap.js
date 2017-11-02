// ~~~~~~~~~~ define all layers first ~~~~~~~~~~~~~~~~~~~~ //
var legionows = "https://db.legiongis.com/geoserver/ows?";

var outdoors = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token='+mapbox_api_key,{maxNativeZoom:18,maxZoom:19})
var mapbox_osm = L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token='+mapbox_api_key,{maxNativeZoom:18,maxZoom:19});

mapLink = '<a href="http://www.esri.com/">Esri</a>';
wholink = 'i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
var esri_aerial = L.tileLayer(
    'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; '+mapLink+', '+wholink,
    maxZoom: 19,
});

var hillshade = L.tileLayer.wms(legionows, {
    layers: 'elevation:driftless_hillshade',
    format: 'image/png',
    transparent: true,
    attribution: "Hillshade derived from WisconsinView LiDAR",
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
    attribution: "HUC boundaries from WIDNR",
    tiled: true,
    maxZoom:19,
});

var bedrock = L.tileLayer.wms(legionows, {
    layers: 'csp:Crawford_Depth_to_Bedrock',
    format: 'image/png',
    transparent: true,
    attribution: "HUC boundaries from WIDNR",
    tiled: true,
    maxZoom:19,
});

var wi_geology = L.tileLayer.wms(legionows, {
    layers: 'wi_ref:geology_a_wi_usgs_2005',
    format: 'image/png',
    transparent: true,
    attribution: "Op and Osi geological units, USGS",
    tiled: true,
    opacity:0.4,
    styles:'CarbonateBedrock',
    maxZoom:19,
});

var frac = L.tileLayer.wms(legionows, {
    layers: 'csp:fracture_lines',
    format: 'image/png',
    transparent: true,
    attribution: "Fracture Lines, drawn by CSP staff",
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
    CQL_FILTER: "in_nfhl <> true OR in_row <> true",
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
    maxZoom:19,
});

// experimenting with new PLSS layers
var qqsections = L.tileLayer.wms(legionows, {
    layers: 'wi_ref:plss_qqsections_sw_wi',
    format: 'image/png',
    transparent: true,
    // attribution: "Fracture Lines, drawn by CSP staff",
    tiled: true,
    maxZoom:19,
});
var qsections = L.tileLayer.wms(legionows, {
    layers: 'wi_ref:plss_qsections',
    format: 'image/png',
    transparent: true,
    // attribution: "Fracture Lines, drawn by CSP staff",
    tiled: true,
    maxZoom:19,
});
var sections = L.tileLayer.wms(legionows, {
    layers: 'wi_ref:plss_sections',
    format: 'image/png',
    transparent: true,
    // attribution: "Fracture Lines, drawn by CSP staff",
    tiled: true,
    maxZoom:19,
});
var townships = L.tileLayer.wms(legionows, {
    layers: 'wi_ref:plss_townships',
    format: 'image/png',
    transparent: true,
    // attribution: "Fracture Lines, drawn by CSP staff",
    tiled: true,
    maxZoom:19,
});

// use the overlay class from leaflet.wms.js to make a non-tiled layer.
// necessary for better labeling apparently
var mcd = L.WMS.overlay(legionows, {
    'layers': 'wi_ref:cities_towns_and_villages',
    'format': 'image/png',
    'transparent': true,
    // 'attribution': "Minor Civil Divisions, Fall 2017",
    'CQL_FILTER': "cnty_name IN ('CRAWFORD','VERNON','IOWA','GRANT','RICHLAND','LAFAYETTE')"
});
mcd.options = {'attribution':"Minor Civil Divisions Fall 2017"};

var counties = L.WMS.overlay(legionows, {
    'layers': 'wi_ref:wi_counties_nrcs_4269',
    'transparent': true,
    'format':'image/png',
    'CQL_FILTER': "countyname IN ('Crawford','Vernon','Iowa','Grant','Richland','Lafayette')",
});
counties.options = {'attribution':"NRCS Counties"};

var boundaries = L.layerGroup([mcd,counties]);

// ~~~~~~~~~~ intantiate map and stuff ~~~~~~~~~~~~~~~~~~~~ //

var map = L.map('karstmap',{zoomControl:false}).setView([43.22219, -90.9201], 10);

// add the minimap right away
var osm_minimap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token='+mapbox_api_key,{maxNativeZoom:18,maxZoom:19});
var c_minimap = new L.Control.MiniMap(osm_minimap,{toggleDisplay:true,minimized:true});map.addControl(c_minimap);

// add initial layers to map
map.addLayer(outdoors);
map.addLayer(boundaries);
map.addLayer(sinks);

var baseLayers = {
    "Open Street Map":outdoors,
    "Aerial Imagery":esri_aerial,
    "SW WI Hillshade":hillshade,
    "USGS Topo *":usgs
};

var overlayLayers = {
    "Carbonate Bedrock":wi_geology,
    "Depth to Bedrock *":bedrock,
    "Civil Boundaries":boundaries,
    "Watershed Boundaries":watersheds,
    "Fracture Lines *":frac,
    "PLSS &frac14; &frac14; Sections":qqsections,
    "PLSS &frac14; Sections":qsections,
    "PLSS Sections":sections,
    "PLSS Townships":townships,
    "Sink Locations *":sinks
};

// explicitly set all of the layer zindex values. this is necessary because
// the auto z-indexing doesn't seem to work on the L.WMS.overlay layers
outdoors.setZIndex(1);
esri_aerial.setZIndex(2);
hillshade.setZIndex(3);
usgs.setZIndex(4);
wi_geology.setZIndex(5);
bedrock.setZIndex(6);
mcd.options['zIndex'] = 7;
counties.options['zIndex'] = 8;
watersheds.setZIndex(9);
frac.setZIndex(10);
qqsections.setZIndex(11);
qsections.setZIndex(12);
sections.setZIndex(13);
townships.setZIndex(14);
sinks.setZIndex(15);

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

var marker;
var getSinkForm = function (e) {
    var getFeatureUrl = sinkIdentifyLayer.getFeatureInfoUrl(e.latlng,'application/json');
    $.ajax({
        url:getFeatureUrl,
        success: function (data){
            if (data.features.length == 0) {
                console.log("no sink here!");
                $("#panel-content").html('<div class="form-msg" style="text-align:center;margin-top:20px;"><p style="font-weight:900;font-size:20px;">no sink here...</p></div>')
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