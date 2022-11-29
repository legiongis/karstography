
import {
  Vector as VectorSource,
  VectorTile as VectorTileSource,
  XYZ, TileWMS,
} from 'ol/source';
import {GeoJSON, MVT} from 'ol/format';
import {Style, Fill, Stroke, Circle, Icon} from 'ol/style';
import {
  Heatmap as HeatmapLayer,
  Tile as TileLayer,
  VectorTile as VectorTileLayer,
  Vector as VectorLayer,
} from 'ol/layer';

import { applyStyle } from 'ol-mapbox-style';

const greenFill =  new Fill({
  color: '#00ed00',
})
const stroke = new Stroke({
  color: '#3399CC',
  width: 1.25,
});
const blackStroke = new Stroke({
  color: 'black',
  width: 2,
})
const whiteStroke = new Stroke({
  color: 'white',
  width: 2,
})
const highlightStroke = new Stroke({
  color: '#00ffaa',
  width: 2,
})

export const styleDefs = {

  greenFill: greenFill,

  wells: new Style({
    image: new Circle({
      fill: greenFill,
      stroke: stroke,
      radius: 5,
    }),
    fill: greenFill,
    stroke: stroke,
  }),

  highlight: new Style({
    image: new Circle({
      fill: null,
      stroke: highlightStroke,
      radius: 8,
    })
  }),

  sinkholeProbStyle: new Style({
    image: new Circle({
      fill: greenFill,
      stroke: blackStroke,
      radius: 4,
    })
  }),

  sinkholePossStyle: new Style({
    image: new Circle({
      fill: greenFill,
      stroke: whiteStroke,
      radius: 4,
    }),
  }),

  poiStyle: new Style({
    image: new Icon({
      scale: .5,
      src: '/static/img/bullseye-thick-50px.png',
    }),
  }),
}

// BASE LAYER CREATION SECTION
function mapboxOutdoors(apiKey) {
  return {
    id: "outdoors",
    name: "Open Street Map",
    layer: new TileLayer({
      source: new XYZ({
        url: 'https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=' + apiKey,
        // tileSize: 512,
        // resolution: 2,
      }),
      zIndex: 1,
    })
  };
}
function outdoorsLabels(apiKey) {
  return {
    id: "labels",
    name: "Labels",
    layer: new TileLayer({
      source: new XYZ({
        url: 'https://api.mapbox.com/styles/v1/legiongis/cjhjd3d030ofi2rmszflafhuu/tiles/256/{z}/{x}/{y}?access_token=' + apiKey,
        // tileSize: 512,
        // resolution: 1,
      }),
      zIndex: 2,
    })
  };
};
function mapboxAerial(apiKey) {
  return {
    id: 'aerial',
    name: 'Aerial Imagery',
    layer: new TileLayer({
      source: new XYZ({
        url: 'https://api.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token='+apiKey,
        // tileSize: 512,
      }),
      zIndex: 1,
    })
  }
}
function hillshade() {
  return {
    id: "hillshade",
    name: "SW WI Hillshade",
    layer: new TileLayer({
      source: new TileWMS({
        url: "https://gn.legiongis.com/geoserver/ows",
        params: {
          'LAYERS': 'wi-elevation:sw-wi-hillshade',
          'TILED': true,
        },
      }),
      zIndex: 1,
    })
  }
}
function usgsTopo() {
  return {
    id: "usgstopo",
    name: "USGS Topo",
    layer: new TileLayer({
      source: new TileWMS({
        url: "https://gn.legiongis.com/geoserver/ows",
        params: {
          'LAYERS': 'karstography:drg_s_wi023_opt',
          'TILED': true,
        },
      }),
      zIndex: 1,
    }),
  }
}
function crawfordTPI() {
  return {
    id: "tpi",
    name: "Topographic Position Index",
    layer: new TileLayer({
      source: new TileWMS({
        url: "https://gn.legiongis.com/geoserver/ows",
        params: {
          'LAYERS': 'karstography:Crawford_TPI_int16-3857_complete',
          'TILED': true,
        },
        attributions: "<a href='http://www.gdal.org/gdaldem.html#gdaldem_TPI' target='_blank'>TPI</a> derived from <a href='http://www.wisconsinview.org/'>WisconsinView</a> LiDAR",
      })
    }),
  }
}

// KARST LAYER SECTION

const wellsLayer = new VectorTileLayer({
  declutter: false,
  source: new VectorTileSource({
    attributions: 'WNHGS',
    format: new MVT(),
    url: 'http://localhost:7800/public.cspkarst_well/{z}/{x}/{y}.pbf'
  }),
  style: styleDefs.wells,
  zIndex: 40,
  id: 'wells',
});

function getSinkholeStyle(feature) {
  if (feature.getProperties().confidence == "PROBABLE") {
    return [styleDefs.sinkholeProbStyle]
  } else {
    return [styleDefs.sinkholePossStyle]
  }
}

const sinkholesLayer = new VectorTileLayer({
  declutter: false,
  source: new VectorTileSource({
    attributions: 'WNHGS',
    format: new MVT(),
    url: "http://localhost:7800/public.cspkarst_sink/{z}/{x}/{y}.pbf?filter=sink_type='SINKHOLE'"
  }),
  style: getSinkholeStyle,
  zIndex: 39,
  id: 'sinkholes',
})

// seems like the best way to keep heatmap visually "static", i.e. make it
// cover the exact same extent regardless of zoom level, would be to attach
// a listener to map.on('moveend') which gets the new zoom level and uses
// setRadius and setBlur on this layer.
const sinkholeHeatmapLayer = new HeatmapLayer({
  zIndex: 32,
  id: 'heatmap',
  source: new VectorSource({
    url: "/api/v1/sinks?format=geojson&sink_type=SINKHOLE",
    format: new GeoJSON(),
  }),
  blur: 20, // default is 8
  radius: 10, // default is 15
  // weight: 1, // this can hold a function as well
  // gradient: [] // default is ['#00f', '#0ff', '#0f0', '#ff0', '#f00']
});

const sinkPaint = {
  "circle-color": [
    "case", // Begin case expression
    ["==", ["get", "sink_type"], "SINKHOLE"],
    "#00ee00",
    ["==", ["get", "sink_type"], "CATCHMENT"],
    "#0000ee",
    ["==", ["get", "sink_type"], "QUARRY"],
    "#ff9000",
    ["==", ["get", "sink_type"], "DC"],
    "#ff00ee",
    ["==", ["get", "sink_type"], "FOUNDATION"],
    "#906b2b",
    ["==", ["get", "sink_type"], "OTHER"],
    "#eeee00",
    ["==", ["get", "sink_type"], "UNKNOWN"],
    "#ee0000",
    "black",
  ],
  "circle-radius": 3,
}

const sinks12StyleDef = {
  "version": 8,
  "sources": {
    "sinks": {
      "type": "vector",
      "tiles": [
        "http://localhost:7800/public.cspkarst_sink_12/{z}/{x}/{y}.pbf?properties=sink_type,in_nfhl,in_row&filter=in_nfhl%20=%20'false'%20AND%20in_row%20=%20'false'",
      ]
    }
  },
  "layers": [
    {
      "id": "public.cspkarst_sink_12",
      "source": "sinks",
      "source-layer": "public.cspkarst_sink_12",
      "type": "circle",
      "paint": sinkPaint,
    }
  ]  
}

const sinks12Layer = new VectorTileLayer({
  declutter: false,
  zIndex: 32,
  id: 'sinks12',
})
applyStyle(sinks12Layer, sinks12StyleDef)

const sinks25StyleDef = {
  "version": 8,
  "sources": {
    "sinks": {
      "type": "vector",
      "tiles": [
        "http://localhost:7800/public.cspkarst_sink_25/{z}/{x}/{y}.pbf?properties=sink_type,in_nfhl,in_row&filter=in_nfhl%20=%20'false'%20AND%20in_row%20=%20'false'",
      ]
    }
  },
  "layers": [
    {
      "id": "public.cspkarst_sink_25",
      "source": "sinks",
      "source-layer": "public.cspkarst_sink_25",
      "type": "circle",
      "paint": sinkPaint,
    }
  ]  
}

const sinks25Layer = new VectorTileLayer({
  declutter: false,
  zIndex: 33,
  id: 'sinks25',
})
applyStyle(sinks25Layer, sinks25StyleDef)

const sinks5StyleDef = {
  "version": 8,
  "sources": {
    "sinks": {
      "type": "vector",
      "tiles": [
        "http://localhost:7800/public.cspkarst_sink_5/{z}/{x}/{y}.pbf?properties=sink_type,in_nfhl,in_row&filter=in_nfhl%20=%20'false'%20AND%20in_row%20=%20'false'",
      ]
    }
  },
  "layers": [
    {
      "id": "public.cspkarst_sink_5",
      "source": "sinks",
      "source-layer": "public.cspkarst_sink_5",
      "type": "circle",
      "paint": sinkPaint,
    }
  ]  
}

const sinks5Layer = new VectorTileLayer({
  declutter: false,
  zIndex: 34,
  id: 'sinks5',
})
applyStyle(sinks5Layer, sinks5StyleDef)

const fracLineLayer = new TileLayer({
  id: "frac",
  zIndex: 30,
  source: new TileWMS({
    url: "https://gn.legiongis.com/geoserver/ows",
    params: {
      'LAYERS': 'general:fracture_lines',
      'TILED': true,
    },
  }),
  attributions: "Fracture Lines (CSP staff)"
})


// CIVIL LAYER SECTION

const mcdLayer = new TileLayer({
  zIndex: 26,
  id: "mcd",
  source: new TileWMS({
    url: "https://gn.legiongis.com/geoserver/ows",
    params: {
      LAYERS: 'general:cities_towns_and_villages',
      TILED: true,
      CQL_FILTER: "cnty_name IN ('CRAWFORD','VERNON','IOWA','GRANT','RICHLAND','LAFAYETTE')"
    },
  }),
  attributions: "Minor Civil Divisions (Fall 2017)",
})
const countyLayer = new TileLayer({
  zIndex: 27,
  id: "counties",
  source: new TileWMS({
    url: "https://gn.legiongis.com/geoserver/ows",
    params: {
      LAYERS: 'general:wi_counties_nrcs_4269',
      TILED: true,
      CQL_FILTER: "countyname IN ('Crawford','Vernon','Iowa','Grant','Richland','Lafayette')",
    },
  }),
  attributions: "Counties <a href='https://gdg.sc.egov.usda.gov/' target='_blank'>NRCS</a>",
})

const qsectionsLayer = new TileLayer({
  id: "plss_qsections",
  zIndex: 23,
  source: new TileWMS({
    url: "https://gn.legiongis.com/geoserver/ows",
    params: {
      'LAYERS': 'general:plss_qsections',
      'TILED': true,
    },
  })
})
const sectionsLayer = new TileLayer({
  id: "plss_sections",
  zIndex: 23,
  source: new TileWMS({
    url: "https://gn.legiongis.com/geoserver/ows",
    params: {
      'LAYERS': 'general:plss_sections',
      'TILED': true,
    },
  })
})
const townshipsLayer = new TileLayer({
  id: "townships",
  zIndex: 30,
  source: new TileWMS({
    url: "https://gn.legiongis.com/geoserver/ows",
    params: {
      'LAYERS': 'general:plss_townships',
      'TILED': true,
    },
  })
})


// NATURAL LAYER SECTION

const carbLayer = new TileLayer({
  id: "carbonate",
  zIndex: 21,
  source: new TileWMS({
    url: "https://gn.legiongis.com/geoserver/ows",
    params: {
      'LAYERS': 'general:geology_a_wi_usgs_2005',
      'TILED': true,
      'STYLES': 'geology_carbonate_wi'
    },
  })
})
const depthLayer = new TileLayer({
  id: "bedrockDepth",
  zIndex: 22,
  source: new TileWMS({
    url: "https://gn.legiongis.com/geoserver/ows",
    params: {
      'LAYERS': 'karstography:Crawford_Depth_to_Bedrock',
      'TILED': true,
    },
  })
})
const watershedsLayer = new TileLayer({
  id: "watersheds",
  zIndex: 28,
  source: new TileWMS({
    url: "https://gn.legiongis.com/geoserver/ows",
    params: {
      'LAYERS': 'general:wi_watersheds',
      'TILED': true,
    },
  })
})

// POI/EXAMPLES LAYER
const poiLayer = new VectorLayer({
  zIndex: 5000,
  id: 'pois',
  source: new VectorSource({
    url: "/api/v1/pois?format=geojson",
    format: new GeoJSON(),
  }),
  style: styleDefs.poiStyle,
});

export class LayerDefs {

  labelLayer = function(apiKey) {
    return outdoorsLabels(apiKey)
  }

  baseLayers = function(apiKey) {
    return [
      mapboxOutdoors(apiKey),
      mapboxAerial(apiKey),
      hillshade(),
      usgsTopo(),
      crawfordTPI(),
    ]
  }

  karstLayers = function() {
    return [
      {
        name:"Private Well Locations",
        id: wellsLayer.get('id'),
        layer: wellsLayer,
        visible: false
      },
      {
        name:"Sinkholes", 
        id: sinkholesLayer.get('id'), 
        layer: sinkholesLayer, 
        visible: true,
        info: '<img src="https://gn.legiongis.com/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=karstography:cspkarst_sinkholes-prod&LEGEND_OPTIONS=fontName:URW%20Gothic%20L%20Book;bgColor:0x96BEF1;dpi:300&env=size:1" style="width:140px" />'},
      {
        name:"Sinkholes - Heatmap", 
        id: sinkholeHeatmapLayer.get('id'), 
        layer: sinkholeHeatmapLayer, 
        visible: true
      },
      {
        name:"Sinks (depth: 1-2 ft)", 
        id: sinks12Layer.get('id'), 
        layer: sinks12Layer, 
        visible: false,
        info: '<img src="https://gn.legiongis.com/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=karstography:cspkarst_sink_12-prod&LEGEND_OPTIONS=fontName:URW%20Gothic%20L%20Book;bgColor:0x96BEF1;dpi:300&env=size:10" style="width:140px" />'},
      {
        name:"Sinks (depth: 2-5 ft)",
        id: sinks25Layer.get('id'),
        layer: sinks25Layer,
        visible: false,
        info: '<img src="https://gn.legiongis.com/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=karstography:cspkarst_sink_12-prod&LEGEND_OPTIONS=fontName:URW%20Gothic%20L%20Book;bgColor:0x96BEF1;dpi:300&env=size:10" style="width:140px" />'},
      {
        name:"Sinks (depth: 5+ ft)",
        id: sinks5Layer.get('id'),
        layer: sinks5Layer,
        visible: false,
        info: '<img src="https://gn.legiongis.com/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=karstography:cspkarst_sink_12-prod&LEGEND_OPTIONS=fontName:URW%20Gothic%20L%20Book;bgColor:0x96BEF1;dpi:300&env=size:10" style="width:140px" />'},
      {
        name:"Fracture Lines",
        id: fracLineLayer.get('id'),
        layer: fracLineLayer,
        visible: false
      },
    ]
  }

  civilLayers = function() {
    return [
      {
        name:"Minor Civil Divisions",
        id: mcdLayer.get('id'),
        layer: mcdLayer, visible: true
      },
      {
        name:"Counties",
        id: countyLayer.get('id'),
        layer: countyLayer,
        visible: false
      },
      {
        name:"PLSS ¼ Sections",
        id: qsectionsLayer.get('id'),
        layer: qsectionsLayer, 
        visible: false
      },
      {
        name:"PLSS Sections",
        id: sectionsLayer.get('id'),
        layer: sectionsLayer,
        visible: false
      },
      {
        name:"PLSS Townships",
        id: townshipsLayer.get('id'),
        layer: townshipsLayer,
        visible: false
      },
    ]
  }

  naturalLayers = function() {
    return [
      {
        name:"Carbonate Bedrock",
        id: carbLayer.get('id'),
        layer: carbLayer,
        visible: false,
        info: '<img src="https://gn.legiongis.com/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=general:geology_a_wi_usgs_2005&STYLE=geology_carbonate_wi&LEGEND_OPTIONS=fontName:URW%20Gothic%20L%20Book;bgColor:0x96BEF1;dpi:300" style="width:140px" />'
      },
      {
        name:"Depth to Bedrock", 
        id: depthLayer.get('id'),
        layer: depthLayer,
        visible: false,
        info: ' <img src="https://gn.legiongis.com/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=karstography:Crawford_Depth_to_Bedrock&LEGEND_OPTIONS=fontName:URW%20Gothic%20L%20Book;bgColor:0x96BEF1;dpi:300;columns:3" style="width:150px" />'
      },
      {
        name:"Watershed Boundaries",
        id: watershedsLayer.get('id'),
        layer: watershedsLayer,
        visible: false
      },
    ]
  }

  poiLayer = function() {
    return {
      name: "Examples",
      id: poiLayer.get('id'),
      layer: poiLayer,
      visible:false,      
    }
  }
}
