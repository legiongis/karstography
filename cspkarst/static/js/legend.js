var seeLegend = '&nbsp;&nbsp;<i class="fa fa-info-circle open-legend-btn" title="open legend for more info"></i>';
var refreshLayer = '&nbsp;&nbsp;<i class="fa fa-refresh refresh-layer-icon" title="refresh layer"></i>';

function generateLayerGroupLegend(layerGroup, htmlElId, basemapGroup=false) {
  layerGroup.eachLayer(function(layer) {
    if (!layer.legendInfo) { moreInfo = '' } else { moreInfo = seeLegend }
    if (!layer.refreshable) { refreshable = '' } else { refreshable = refreshLayer }
    if (basemapGroup == true) {
      var boxType = 'radio';
      var cssClass = 'basemap-layer';
      var elName = 'leaflet-base-layers';
    } else {
      var boxType = 'checkbox';
      var cssClass = 'overlay-layer';
      var elName = '';
    }
    var elHtml = `
      <div class="col-xs-12 layer-column">
          <label>
              <div style="display:inline">
                  <input id="`+layer.id+`" type="`+boxType+`" class="`+cssClass+` leaflet-control-layers-selector" name="`+elName+`" checked="">
                  <span> `+layer.name+`</span>
              </div>
          </label>
          <div class="layer-extra-icons">`+moreInfo+refreshable+`</div>
      </div>`
    div = document.getElementById( htmlElId );
    div.insertAdjacentHTML( 'beforeend', elHtml );
  });
}

generateLayerGroupLegend(baseLayersGrp, 'basemap-collection', true);
generateLayerGroupLegend(naturalLayersGrp, 'natural-collection');
generateLayerGroupLegend(civilLayersGrp, 'civil-collection');
generateLayerGroupLegend(karstLayersGrp, 'karst-collection');

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
    self = this;
    allLayersGrp.eachLayer(function(layer) {
        if (layer.id === self.id) {
            if (map.hasLayer(layer)) {
                map.removeLayer(layer);
            } else {
                map.addLayer(layer);
            }
        }
    });
})
