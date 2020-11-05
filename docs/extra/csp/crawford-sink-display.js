// BASEMAP LAYERS
arrayOSM = ["http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg",
            "http://otile2.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg",
            "http://otile3.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg",
            "http://otile4.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg"];

var legionwms = "https://db.legiongis.com/geoserver/wms/";
            
var osm_attr = new ol.control.Attribution({
    html: '&copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors.'
});

var hillshade = {
    id: "hillshade",
    info: "LiDAR hillshade derivative, 5ft",
    layer: new ol.layer.Tile({
        name: 'hillshade',
        source: new ol.source.TileWMS({
            url: legionwms,
            params: {
                'LAYERS':'elevation:driftless_hillshade',
                'TILED':true,
            },
            serverType: 'geoserver'
        }),
    })
};

var watersheds = {
    id: "watersheds",
    info: "Hydrologic Units - Categories 8, 10, 12",
    layer: new ol.layer.Tile({
        name: 'watersheds',
        source: new ol.source.TileWMS({
            url: legionwms,
            params: {
                'LAYERS':'wi_ref:wi_watersheds',
                'TILED':true,
            },
            serverType: 'geoserver'
        }),
    })
};

var sinks1_2 = {
    id: "s1-2",
    info: "sinkholes",
    layer: new ol.layer.Tile({
        name: 'sinks',
        source: new ol.source.TileWMS({
            url: legionwms,
            params: {
                'LAYERS':'csp:cspkarst_sink_12',
                'TILED':true,
                'cql_filter':"in_nfhl = false AND in_row = false",
            },
            serverType: 'geoserver'
        }),
    })
};

var sinks2_5 = {
    id: "s2-5",
    info: "sinkholes",
    layer: new ol.layer.Tile({
        name: 'sinks',
        source: new ol.source.TileWMS({
            url: legionwms,
            params: {
                'LAYERS':'csp:cspkarst_sink_25',
                'TILED':true,
                'cql_filter':"in_nfhl = false AND in_row = false",
            },
            serverType: 'geoserver'
        }),
    })
};

var sinks5 = {
    id: "s5",
    info: "sinkholes",
    layer: new ol.layer.Tile({
        name: 'sinks',
        source: new ol.source.TileWMS({
            url: legionwms,
            params: {
                'LAYERS':'csp:cspkarst_sink_5',
                'TILED':true,
                'cql_filter':"in_nfhl = false AND in_row = false",
            },
            serverType: 'geoserver'
        }),
    })
};


// EMPTY LAYER
var blank = {
    id: "blank",
    layer: new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: '',
        })
    })
};

var basemaps = [hillshade,blank];
var sink_layers = [sinks1_2,sinks2_5,sinks5,blank];
$('#hillshade').addClass('selected');
$('#s5').addClass('selected');

var collection = new ol.Collection([hillshade.layer,watersheds.layer,sinks5.layer]);

var info_shown = false

var controls = [
    new ol.control.MousePosition({
        undefinedHTML: '<b>n/a</b>',
        projection: 'EPSG:4326',
        coordinateFormat: function(coordinate) {
            return ol.coordinate.format(coordinate, '<b>{x}, {y}</b>', 3)
        }
    }),
    new ol.control.Zoom({
        zoomInTipLabel: 'zoom in',
        zoomOutTipLabel: 'zoom out'
    }),
    new ol.control.Attribution({
        tipLabel: 'layer attributions',
    })
];

var map = new ol.Map({
    target: 'map',
    renderer: 'canvas',
    layers: collection,
    controls: controls,
    view: new ol.View({
        center: ol.proj.transform([-90.925, 43.215], 'EPSG:4326', 'EPSG:3857'),
        minZoom: 9,
        maxZoom: 19,
        zoom: 10,
    }),
    minZoomLevel: 7,
});

function selectBasemap() {
    $('.bm').on('click', function() {
        $('.bm').removeClass('selected');
        $(this).addClass('selected');
        for(var i=0; i < basemaps.length; i++) {
            var basemap = basemaps[i]
            if (basemap.id === $(this).attr('id')) {
                collection.setAt(0, basemap.layer);
                
                break;
            }
        }
        map.setLayerGroup = new ol.layer.Group(collection);
    });
};

function selectOverlay() {
    $('.hm').on('click', function() {
        $('.hm').removeClass('selected');
        $(this).addClass('selected');
        for(var i=0; i < sink_layers.length; i++) {
            var overlay = sink_layers[i]
            if (overlay.id === $(this).attr('id')) {
                collection.setAt(2, overlay.layer);
                
                document.getElementById('layer-info').innerHTML = overlay.info
                break;
            }
        }
        map.setLayerGroup = new ol.layer.Group(collection);
    });
};

function toggleInfo() {
    $("#toggleinfo1").click(function(){
        if ($("#info1").is(":hidden")) {
            $("#info1").show();
            document.getElementById('toggleinfo1').innerHTML = "hide legend";
        } else {
            $("#info1").hide();
            document.getElementById('toggleinfo1').innerHTML = "show legend";
        }
    });
};

function toggleNote() {
    $("#toggleinfo2").click(function(){
        if ($("#info2").is(":hidden")) {
            $("#info2").show();
            document.getElementById('toggleinfo2').innerHTML = "hide basemap info";
        } else {
            $("#info2").hide();
            document.getElementById('toggleinfo2').innerHTML = "show basemap info";
        }
    });
};

$(document).ready(function() {
    toggleInfo();
    toggleNote();
    selectOverlay()
    selectBasemap();
   
}); 
