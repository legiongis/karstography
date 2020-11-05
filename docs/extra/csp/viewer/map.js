var mapbox_api_key = 'pk.eyJ1IjoibGVnaW9uZ2lzIiwiYSI6ImNpdzg1ZXVvbjAxa2IydG1zcm5kcnZ5NXIifQ.dTfsQ7s5nQv59mHKcNPi_w'
var map = L.map('map').setView([43.22219, -90.9201], 10);

// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token='+mapbox_api_key, {
    // maxZoom: 18,
    // attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        // '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        // 'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    // id: 'mapbox.streets'
// }).addTo(map);

    var outdoors = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token='+mapbox_api_key,{maxNativeZoom:18,maxZoom:19})
    var mapbox_osm = L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token='+mapbox_api_key,{maxNativeZoom:18,maxZoom:19});
    
    mapLink = '<a href="http://www.esri.com/">Esri</a>';
    wholink = 'i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
    var esri_aerial = L.tileLayer(
            'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '&copy; '+mapLink+', '+wholink,
            maxZoom: 18,
            });
            
    var counties = L.tileLayer.wms('https://db.legiongis.com/geoserver/ows?', {
        layers: 'wi_ref:wi_counties_nrcs_4269',
        format: 'image/png',
        transparent: true,
        attribution: ""
    })
    
    map.addLayer(outdoors);
    map.addLayer(counties);
    
    var hillshade = L.tileLayer.wms('https://db.legiongis.com/geoserver/ows?', {
        layers: 'elevation:driftless_hillshade',
        format: 'image/png',
        transparent: true,
        attribution: "Hillshade derived from WisconsinView LiDAR"
    })
    var watersheds = L.tileLayer.wms('https://db.legiongis.com/geoserver/ows?', {
        layers: 'wi_ref:wi_watersheds',
        format: 'image/png',
        transparent: true,
        attribution: "HUC boundaries from WIDNR"
    })
    var bedrock = L.tileLayer.wms('https://db.legiongis.com/geoserver/ows?', {
        layers: 'csp:Crawford_Depth_to_Bedrock',
        format: 'image/png',
        transparent: true,
        attribution: "HUC boundaries from WIDNR"
    })
    var frac = L.tileLayer.wms('https://db.legiongis.com/geoserver/ows?', {
        layers: 'csp:fracture_lines',
        format: 'image/png',
        transparent: true,
        attribution: "HUC boundaries from WIDNR"
    })
    var sinks = L.tileLayer.wms('https://db.legiongis.com/geoserver/ows?', {
        layers: 'csp:sinkholes_0817',
        format: 'image/png',
        transparent: true,
        attribution: "HUC boundaries from WIDNR",
        styles: 'sink_depth'
    })
    
    var baseLayers = {
        "Open Street Map": outdoors,
        "Aerial Imagery": esri_aerial
    };
    

    var overlaysDict = {
        "Hillshade":hillshade,
        "Crawford Co Bedrock":bedrock,
        "Watersheds":watersheds,
        "Fracture Lines":frac,
        "Sinkholes (sized by depth)":sinks,
        "WI Counties":counties,
    };

    L.control.layers(baseLayers, overlaysDict).addTo(map);

// L.marker([51.5, -0.09]).addTo(map)
    // .bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();

// L.circle([51.508, -0.11], 500, {
    // color: 'red',
    // fillColor: '#f03',
    // fillOpacity: 0.5
// }).addTo(map).bindPopup("I am a circle.");

// L.polygon([
    // [51.509, -0.08],
    // [51.503, -0.06],
    // [51.51, -0.047]
// ]).addTo(map).bindPopup("I am a polygon.");


var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);