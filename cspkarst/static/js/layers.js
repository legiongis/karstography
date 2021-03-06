// ~~~~~~~~~~ define all layers ~~~~~~~~~~~~~~~~~~~~ //
const legionDBOWS = "https://db.legiongis.com/geoserver/ows?";
const legionGeoNodeOWS = "https://gn.legiongis.com/geoserver/wms?";

var outdoors = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token='+mapbox_api_key,{
  maxNativeZoom: 18,
  maxZoom: 19,
  pane: 'tilePane',
})
outdoors.id = "outdoors";
outdoors.name = "Open Street Map";

var mapbox_osm = L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token='+mapbox_api_key,{
  maxNativeZoom: 18,
  maxZoom: 19,
  pane: 'tilePane',
});
mapbox_osm.id = 'mapbox_osm'

var mapbox_aerial = L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token='+mapbox_api_key,{
  maxNativeZoom: 18,
  maxZoom: 19,
  pane: 'tilePane',
});
mapbox_aerial.id = "mapbox_aerial";
mapbox_aerial.name = "Aerial Imagery";

var outdoors_labels = L.tileLayer('https://api.mapbox.com/styles/v1/legiongis/cjhjd3d030ofi2rmszflafhuu/tiles/256/{z}/{x}/{y}?access_token='+mapbox_api_key,{
  maxNativeZoom: 18,
  maxZoom: 19,
  pane: 'tilePane',
});
outdoors_labels.id = 'outdoors_labels'

var hillshade = L.tileLayer.wms(legionDBOWS, {
    layers: 'elevation:driftless_hillshade',
    format: 'image/png',
    transparent: true,
    attribution: "Hillshade derived from <a href='http://www.wisconsinview.org/' target='_blank'>WisconsinView</a> LiDAR",
    tiled: true,
    maxZoom:19,
    pane: 'tilePane',
});
hillshade.id = 'hillshade'
hillshade.name = "SW WI Hillshade";

var tpi = L.tileLayer.wms(legionDBOWS, {
    layers: 'csp:Crawford_TPI_int16-3857_complete',
    format: 'image/png',
    transparent: true,
    attribution: "<a href='http://www.gdal.org/gdaldem.html#gdaldem_TPI' target='_blank'>TPI</a> derived from <a href='http://www.wisconsinview.org/'>WisconsinView</a> LiDAR",
    tiled: true,
    maxZoom:19,
    pane: 'tilePane',
});
tpi.id = 'tpi'
tpi.name = "Topographic Position Index";

var usgs = L.tileLayer.wms(legionDBOWS, {
    layers: 'csp:drg_s_wi023_opt',
    format: 'image/png',
    transparent: true,
    attribution: "USGS Topo",
    tiled: true,
    maxZoom:19,
});
usgs.id = 'usgs'
usgs.name = "USGS Topo";

var watersheds = L.tileLayer.wms(legionGeoNodeOWS, {
    layers: 'general:wi_watersheds',
    format: 'image/png',
    transparent: true,
    attribution: "<a href='http://dnr.wi.gov/topic/watersheds/' target='_blank'>Watershed Boundaries (WIDNR)</a>",
    tiled: true,
    maxZoom:19,
});
watersheds.id = 'watersheds';
watersheds.name = "Watershed Boundaries";

var bedrock = L.tileLayer.wms(legionDBOWS, {
    layers: 'csp:Crawford_Depth_to_Bedrock',
    format: 'image/png',
    transparent: true,
    attribution: "<a href='https://websoilsurvey.sc.egov.usda.gov/App/HomePage.htm' target='_blank'>USGS Soil Survey</a>",
    tiled: true,
    maxZoom:19,
});
bedrock.id = 'bedrock';
bedrock.legendInfo = true;
bedrock.name = "Depth to Bedrock";

var wi_geology = L.tileLayer.wms(legionGeoNodeOWS, {
    layers: 'general:geology_a_wi_usgs_2005',
    format: 'image/png',
    transparent: true,
    attribution: "<a href='https://mrdata.usgs.gov/geology/state/state.php?state=WI' target='_blank'>USGS Geologic Map, WI</a>",
    tiled: true,
    opacity:0.75,
    styles:'geology_carbonate_wi',
    maxZoom:19,
});
wi_geology.id = 'wi_geology'
wi_geology.legendInfo = true;
wi_geology.name = "Carbonate Bedrock";

var sinks12 = L.tileLayer.wms(
    legionGeoNodeOWS, {
    layers: 'karstography:cspkarst_sink_12' + env_suffix,
    format: 'image/png',
    transparent: true,
    attribution: "LiDAR-Derived Sink Locations",
    maxZoom:19,
    CQL_FILTER: "in_nfhl = false AND in_row = false",
    tiled: 'false',
    env: 'size:6',
    pane: 'overlayPane'
});
sinks12.id = 'sinks12';
sinks12.legendInfo = true;
sinks12.refreshable = true;
sinks12.name = "Sinks (depth 1-2 ft)";

var sinks25 = L.tileLayer.wms(legionGeoNodeOWS, {
    layers: 'karstography:cspkarst_sink_25' + env_suffix,
    format: 'image/png',
    transparent: true,
    attribution: "LiDAR-Derived Sink Locations",
    maxZoom:19,
    CQL_FILTER: "in_nfhl = false AND in_row = false",
    tiled: 'false',
    env: 'size:7',
    pane: 'overlayPane'
});
sinks25.id = 'sinks25';
sinks25.legendInfo = true;
sinks25.refreshable = true;
sinks25.name = "Sinks (depth: 2-5 ft)";

var sinks5 = L.tileLayer.wms(legionGeoNodeOWS, {
    layers: 'karstography:cspkarst_sink_5' + env_suffix,
    format: 'image/png',
    transparent: true,
    attribution: "LiDAR-Derived Sink Locations",
    maxZoom:19,
    CQL_FILTER: "in_nfhl = false AND in_row = false",
    tiled: 'false',
    env: 'size:8',
    pane: 'overlayPane'
});
sinks5.id = 'sinks5';
sinks5.legendInfo = true;
sinks5.refreshable = true;
sinks5.name = "Sinks (depth: 5+ ft)";

var sinkholes = L.tileLayer.wms(legionGeoNodeOWS, {
    layers: 'karstography:cspkarst_sinkholes' + env_suffix,
    format: 'image/png',
    transparent: true,
    attribution: "LiDAR-Derived Sink Locations",
    maxZoom:19,
    tiled: 'false',
    pane: 'overlayPane'
});
sinkholes.id = 'sinkholes';
sinkholes.legendInfo = true;
sinkholes.refreshable = true;
sinkholes.name = "Sinkholes";

var sinkholes_heatmap = L.WMS.overlay(legionGeoNodeOWS, {
    layers: 'karstography:cspkarst_sinkholes' + env_suffix,
    styles: 'karst.sink_heatmap',
    format: 'image/png',
    transparent: true,
    pane: 'tilePane',
});
sinkholes_heatmap.id = 'sinkholes_heatmap';
sinkholes_heatmap.name = "Sinkholes - Heatmap";

var frac = L.tileLayer.wms(legionGeoNodeOWS, {
    layers: 'general:fracture_lines',
    format: 'image/png',
    transparent: true,
    attribution: "Fracture Lines (CSP staff)",
    tiled: true,
    maxZoom:19,
    pane: 'overlayPane'
});
frac.id = 'frac';
frac.name = "Fracture Lines";

var getClusterRadius = function(zoom){
  if (zoom < 17) { return 80 }
  if (zoom == 17) { return 50 }
  if (zoom > 17) { return 20 }
}

var wells = L.markerClusterGroup({
  // iconCreateFunction: function(cluster) {
  //   return L.divIcon({
  //     html: '<div><p>' + cluster.getChildCount() + '</p></div>',
  //     className: 'cluster-marker well-cluster'
  //   });
  // },
  polygonOptions: {color: '#01018A'},
  maxClusterRadius: getClusterRadius,
});
wells.id = 'wells';
wells.name = "Private Well Locations";

var addWellsToGroupLayer = function () {
  wells.clearLayers();
  $.ajax({
      url : root_url+"/wells/",
      success : function (data) {

        var arcgisRestUrl = "https://dnrmaps.wi.gov/arcgis/rest/services/DG_Well_Driller/DG_Well_Driller_WTM_Ext/MapServer/0/query?"

        $.each(data['features'], function(index, feature) {
          var marker_coords = [
            feature['geometry']['coordinates'][1],
            feature['geometry']['coordinates'][0]
          ]

          var icon = L.divIcon({className: 'well-icon',html:'<i class="fa fa-circle-o" style="font-size:20px;"></i>'});

          var popupHtml = `
            <h4>WELL ID: ${feature.properties.pk}</h4>
            <h5><a href="${feature.properties.well_constr_url}" target="_blank">View Well Construction Report <i class="fa fa-external-link"></i></a></h5>
            <h5><a href="${feature.properties.sample_db_url}" target="_blank">View Sample Analytical Data<i class="fa fa-external-link"></i></a></h5>
            <h5><a href="${arcgisRestUrl}where=%22WI_UNIQUE_WELL_NO%22=%27${feature.properties.pk}%27&outSR=4326&outFields=*&f=html" target="_blank">Full Database Entry <i class="fa fa-external-link"></i></a></h5>
            <h5><strong>This point location is based on: ${feature.properties.location_method}</strong></h5>
          `
          var popup = L.popup({'className' : 'latlong-popup'})
            .setLatLng(marker_coords)
            .setContent(popupHtml)

          marker = new L.marker(marker_coords, {icon: icon});
          if (user_is_staff == "True") {
            marker.on('click', (function() {
              $('.map-icon').remove();
              $.ajax({
                  url : root_url+"/well-update/"+feature.properties.pk+"/",
                  success : function (response) {
                      $("#info-panel").fadeIn();
                      $("#panel-content").html(response);
                      $("#well-form").submit(function(event) {

                          // Stop form from submitting normally to avoid a redirect
                          event.preventDefault();
                          $.ajax({
                              url:root_url+"/well-update/"+feature.properties.pk+"/",
                              type:'post',
                              data:$('#well-form').serialize(),
                              success:function(){
                                  addWellsToGroupLayer();
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
            ));
          };
          marker.bindPopup(popup);
          wells.addLayer(marker);
        });
      },
      error:function (xhr, ajaxOptions, thrownError){
          if(xhr.status==404) {
              console.log(thrownError);
          }
      }
  });
}
addWellsToGroupLayer()

var qsections = L.tileLayer.wms(legionGeoNodeOWS, {
    layers: 'general:plss_qsections',
    format: 'image/png',
    transparent: true,
    tiled: true,
    maxZoom:19,
});
qsections.id = 'qsections';
qsections.name = "PLSS &frac14; Sections";

var sections = L.WMS.overlay(legionGeoNodeOWS, {
    layers: 'general:plss_sections',
    format: 'image/png',
    transparent: true,
    // 'CQL_FILTER': "cnty_name IN ('CRAWFORD','VERNON','IOWA','GRANT','RICHLAND','LAFAYETTE')"
});
sections.id = 'sections';
sections.name = "PLSS Sections";

var townships = L.tileLayer.wms(legionGeoNodeOWS, {
    layers: 'general:plss_townships',
    format: 'image/png',
    transparent: true,
    tiled: true,
    maxZoom:19,
});
townships.id = 'townships';
townships.name = "PLSS Townships";

// use the overlay class from leaflet.wms.js to make a non-tiled layer.
// necessary for better labeling apparently
var mcd = L.WMS.overlay(legionGeoNodeOWS, {
    layers: 'general:cities_towns_and_villages',
    format: 'image/png',
    transparent: true,
    CQL_FILTER: "cnty_name IN ('CRAWFORD','VERNON','IOWA','GRANT','RICHLAND','LAFAYETTE')"
});
mcd.options = {'attribution':"Minor Civil Divisions Fall 2017"};
mcd.id = 'mcd';

var counties = L.WMS.overlay(legionGeoNodeOWS, {
    layers: 'general:wi_counties_nrcs_4269',
    transparent: true,
    format:'image/png',
    CQL_FILTER: "countyname IN ('Crawford','Vernon','Iowa','Grant','Richland','Lafayette')",
    styles:"counties_karstography"
});
counties.options = {'attribution':"Counties <a href='https://gdg.sc.egov.usda.gov/' target='_blank'>NRCS</a>"};
counties.id = 'counties';

var civil_boundaries = L.layerGroup([mcd, counties]);
civil_boundaries.id = 'civil_boundaries';
civil_boundaries.name = "Civil Boundaries";

// this is an invisible layer with a larger circle style which is used in the
// click selection process. (larger circle means easier selection)
// var sinkIdentifyLayer = new L.tileLayer.betterWms(legionGeoNodeOWS + Math.random(), {
var sinkIdentifyLayer = new L.tileLayer.betterWms(legionGeoNodeOWS, {
    layers: 'karstography:cspkarst_sink' + env_suffix,
    transparent: true,
    styles: 'karst.sink_invisible_10pt',
    format: 'image/png',
});

// explicitly set all of the layer zindex values. not sure how necessary this
// really is (layer ordering also has a lot to do with panes).
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
mcd.options['zIndex'] = 26;
counties.options['zIndex'] = 27;
watersheds.setZIndex(28);
frac.setZIndex(29);
townships.setZIndex(30);
sinks12.setZIndex(32);
sinks25.setZIndex(33);
sinks5.setZIndex(34);

sinkholes_heatmap.options['zIndex'] = 22;
sinkholes.setZIndex(39);
wells.setZIndex(40);

// ~~~~~~~~~~ create arrays to group layers in legend ~~~~~~~~~~~~~~~~~~~~ //
var allLayersArray = [];

// special case to push the labels layer to allLayersGrp
allLayersArray.push(outdoors_labels);

// create array of basemap layers
var baseLayers = [
  outdoors,
  mapbox_aerial,
  hillshade,
  usgs,
  tpi,
];
var baseLayersArray = [];
$.each(baseLayers, function(index, layer){
  allLayersArray.push(layer)
  baseLayersArray.push(layer)
});

// create array of civil layers
var civilLayers = [
  civil_boundaries,
  qsections,
  sections,
  townships,
];
var civilLayersArray = [];
$.each(civilLayers, function(index, layer){
  allLayersArray.push(layer)
  civilLayersArray.push(layer)
});

// create array of natural layers
var naturalLayers = [
  wi_geology,
  bedrock,
  watersheds,
];
var naturalLayersArray = [];
$.each(naturalLayers, function(index, layer){
  allLayersArray.push(layer)
  naturalLayersArray.push(layer)
});

// create array of karst layers
var karstLayers = [
  wells,
  sinkholes,
  sinkholes_heatmap,
  sinks12,
  sinks25,
  sinks5,
  frac,
];
var karstLayersArray = [];
$.each(karstLayers, function(index, layer){
  allLayersArray.push(layer);
  karstLayersArray.push(layer);
});
