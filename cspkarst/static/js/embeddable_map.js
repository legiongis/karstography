// ~~~~~~~~~~ intantiate map and stuff ~~~~~~~~~~~~~~~~~~~~ //
var map = L.map('map',{zoomControl:false}).setView([43.22219, -90.9201], 10);
var hash = new L.Hash(map);

var c_zoom = new L.control.zoom();
var c_fullscreen = new L.Control.Fullscreen({position:'bottomright'});
var c_gps = new L.Control.Gps({position:'topright'});
var c_scalebar = new L.control.scale();

// add all non-minimap controls here
map.addControl(c_zoom);
// map.addControl(c_gps);
map.addControl(c_scalebar);

// make popup that shows lat/long and zoom level on right-click event
var latlongpopup = L.popup({'className' : 'latlong-popup'});
map.on("contextmenu", function (event) {
    var latitude = event.latlng.lat.toFixed(6);
    var longitude = event.latlng.lng.toFixed(6);
    var gm = 'http://maps.google.com/maps?z=7&t=k&q=loc:'+latitude+'+'+longitude;
    var gmlink = '<br><a href="'+gm+'" target="_blank">view in google maps</a>'
    latlongpopup
        .setLatLng(event.latlng)
        .setContent(latitude+', '+longitude+'<br>zoom level: '+map.getZoom()+gmlink)
        .openOn(map);
});

// add initial layers to map
map.addLayer(outdoors);
map.addLayer(outdoors_labels);
map.addLayer(civil_boundaries);
map.addLayer(sinkholes);
map.addLayer(sinkholes_heatmap);

var baseLayers = {
   "Open Street Map":outdoors,
   "Aerial Imagery":mapbox_aerial,
   "SW WI Hillshade":hillshade,
   "USGS Topo *":usgs,
};

var overlayLayers = {
   "Carbonate Bedrock":wi_geology,
   "Depth to Bedrock *":bedrock,
   "Civil Boundaries":civil_boundaries,
   "Watershed Boundaries":watersheds,
   "Fracture Lines *":frac,
   // "PLSS &frac14; &frac14; Sections":qqsections,
   "PLSS &frac14; Sections":qsections,
   "PLSS Sections":sections,
   "PLSS Townships":townships,
   // "Sink Locations *":sinks,
   "Sinks 1-2 ft *":sinks12,
   "Sinks 2-5 ft *":sinks25,
   "Sinks 5+ ft *":sinks5,
   "Sinkholes Heatmap":sinkholes_heatmap,
   "Sinkholes *":sinkholes,
};

var c_layers = new L.control.layers(baseLayers, overlayLayers,{position:'topright'});
map.addControl(c_layers)
