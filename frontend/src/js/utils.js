
import {
  Vector as VectorSource,
  VectorTile as VectorTileSource,
  XYZ, TileWMS,
} from 'ol/source';
import {GeoJSON, MVT} from 'ol/format';
import {Style, Fill, Stroke, Circle, Icon, RegularShape} from 'ol/style';
import {
  Heatmap as HeatmapLayer,
  Tile as TileLayer,
  VectorTile as VectorTileLayer,
  Vector as VectorLayer,
} from 'ol/layer';

import { applyStyle } from 'ol-mapbox-style';
import LayerGroup from 'ol/layer/Group';

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
const selectedStroke = new Stroke({
  color: '#dd06cf',
  width: 2,
})

export const styleDefs = {

  greenFill: greenFill,

  wells: new Style({
    image: new RegularShape({
      fill: new Fill({
        color: 'rgba(1,1,138,.4)',
      }),
      stroke: new Stroke({
        color: 'rgba(1,1,138,.8)',
        width: 1.25,
      }),
      points: 4,
      radius: 4,
      angle: Math.PI / 4,
    }),
  }),

  highlight: new Style({
    image: new Circle({
      fill: null,
      stroke: highlightStroke,
      radius: 8,
    })
  }),

  selected: new Style({
    image: new Circle({
      fill: null,
      stroke: selectedStroke,
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

function makeTitilerXYZLayer(host, cogUrl) {
  const cogUrlEncode = encodeURIComponent(cogUrl)
  let url;
  if (String(cogUrl).endsWith(".json")) {
      url = host +"/mosaicjson/tiles/{z}/{x}/{y}.png?TileMatrixSetId=WebMercatorQuad&url=" + cogUrlEncode;
  } else {
      url = host +"/cog/tiles/{z}/{x}/{y}.png?TileMatrixSetId=WebMercatorQuad&url=" + cogUrlEncode;
  }
  return new TileLayer({
    source: new XYZ({
      url: url,
    }),
    // extent: transformExtent(vol.extent, "EPSG:4326", "EPSG:3857")
  });
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
      zIndex: 30,
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
function hillshade(titilerUrl) {
  const layer = makeTitilerXYZLayer(titilerUrl, "https://legion-maps.us-southeast-1.linodeobjects.com/csp/drg/drg_s_wi023_opt.tif")
  layer.setZIndex(1)
  return {
    id: "hillshade",
    name: "SW WI Hillshade",
    layer: makeTitilerXYZLayer(titilerUrl, "https://legion-maps.us-southeast-1.linodeobjects.com/csp/hillshades/sw-wi-hillshades-mosaic.json"),
  }
}

function usgsTopo(titilerUrl) {
  const layer = makeTitilerXYZLayer(titilerUrl, "https://legion-maps.us-southeast-1.linodeobjects.com/csp/drg/drg_s_wi023_opt.tif")
  layer.setZIndex(1)
  return {
    id: "usgstopo",
    name: "USGS Topo",
    layer: layer,
  }
}
function crawfordTPI(titilerUrl) {
  const layer = makeTitilerXYZLayer(titilerUrl, "https://legion-maps.us-southeast-1.linodeobjects.com/csp/tpi/Crawford_TPI-3857.tif")
  layer.setZIndex(1)
  return {
    id: "tpi",
    name: "Topographic Position Index",
    layer: layer,
  }
}

// KARST LAYER SECTION

// Generally, the layer objects created here need to have the following structure

// id: 'id'
// name: 'Display Name'
// visible: whether to activate layer on initial map load
// info: (optional) a legend item or content
// layer: ol layer object (see below)

// Further, the ol layer object must have an extra 'id' property whose value
// matches the id on the parent wrapper object.

function wellsLayer(pg_tileserv_url) {
  const layerId = 'wells'
  return {
    id: layerId,
    name:"Private Well Locations",
    visible: false,
    layer: new VectorTileLayer({
      id: layerId,
      declutter: false,
      source: new VectorTileSource({
        attributions: 'Wisconsin Department of Natural Resources - Bureau of Drinking Water and Groundater',
        format: new MVT(),
        url: pg_tileserv_url + 'public.cspkarst_well/{z}/{x}/{y}.pbf'
      }),
      style: styleDefs.wells,
      zIndex: 40,
    }),
  }
}

function getSinkholeStyle(feature) {
  if (feature.getProperties().confidence == "PROBABLE") {
    return [styleDefs.sinkholeProbStyle]
  } else {
    return [styleDefs.sinkholePossStyle]
  }
}

function sinkholesLayer(pgTileservUrl) {
  const layerId = 'sinkholes';
  return {
    id: layerId,
    name: 'Sinkholes',
    visible: true,
    info: '<img src="/static/img/sinkhole-layer-legend.png" style="width:140px" />',
    layer: new VectorTileLayer({
      id: layerId,
      declutter: false,
      source: new VectorTileSource({
        attributions: 'WNHGS',
        format: new MVT(),
        url: pgTileservUrl + "public.cspkarst_sink/{z}/{x}/{y}.pbf?filter=sink_type='SINKHOLE'"
      }),
      style: getSinkholeStyle,
      zIndex: 39,
    }),
  }
}

function sinkholeHeatmapLayer() {
  const layerId = 'heatmap';
  return {
    id: layerId,
    name: 'Sinkholes - Heatmap',
    visible: true,
    // seems like the best way to keep heatmap visually "static", i.e. make it
    // cover the exact same extent regardless of zoom level, would be to attach
    // a listener to map.on('moveend') which gets the new zoom level and uses
    // setRadius and setBlur on this layer.
    layer: new HeatmapLayer({
      zIndex: 32,
      id: layerId,
      source: new VectorSource({
        url: "/api/v1/sinks?format=geojson&sink_type=SINKHOLE",
        format: new GeoJSON(),
      }),
      opacity: .7,
      blur: 20, // default is 8
      radius: 10, // default is 15
      // weight: 1, // this can hold a function as well
      // gradient: [] // default is ['#00f', '#0ff', '#0f0', '#ff0', '#f00']
    })
  }
} 

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

function getSinkStyleDef(dbTable, pgTileservUrl, depthCat) {
  // fully encoded the query string doesn't seem to work
  const queryStr = `filter=in_nfhl = 'false' AND in_row = 'false' AND depth_cat = '${depthCat}'`
  const encodedQueryStr = encodeURIComponent(queryStr)
  // the encoding is kind of tricky: encoding the entire string fails, but the spaces must be
  // replaced with %20 and the depth_cat value must be encoded, but not the single quotes or =
  const queryStr2 = `filter=in_nfhl%20=%20'false'%20AND%20in_row%20=%20'false'%20AND%20depth_cat%20=%20'${depthCat}'`
  return {
    version: 8,
    sources: {
      sinks: {
        type: "vector",
        tiles: [
          pgTileservUrl + dbTable + "/{z}/{x}/{y}.pbf?" + queryStr2,
        ]
      }
    },
    layers: [
      {
        id: dbTable,
        source: "sinks",
        'source-layer': dbTable,
        type: "circle",
        paint: sinkPaint,
      }
    ]  
  }
}

function sinks12Layer(pgTileservUrl) {
  const layerId = 'sinks12';
  const layer = new VectorTileLayer({
    id: layerId,
    declutter: false,
    zIndex: 32,
  })
  applyStyle(layer, getSinkStyleDef('public.cspkarst_sink', pgTileservUrl, '1-2'))
  return {
    id: layerId,
    name: 'Sinks (depth: 1-2 ft)',
    visible: false,
    info: '<img src="/static/img/sink-layer-legend.png" style="width:140px;" />',
    layer: layer,
  }
}

function sinks25Layer(pgTileservUrl) {
  const layerId = 'sinks25';
  const layer = new VectorTileLayer({
    id: layerId,
    declutter: false,
    zIndex: 33,
  })
  applyStyle(layer, getSinkStyleDef('public.cspkarst_sink', pgTileservUrl, '2-5'))
  return {
    id: layerId,
    name: 'Sinks (depth: 2-5 ft)',
    visible: false,
    info: '<img src="/static/img/sink-layer-legend.png" style="width:140px;" />',
    layer: layer,
  }
}

function sinks5Layer(pgTileservUrl) {
  const layerId = 'sinks5';
  const layer = new VectorTileLayer({
    id: layerId,
    declutter: false,
    zIndex: 34,
  })
  // there is a '+' character in the depth_cat value which must be url encoded
  // i.e. '5+' becomes '5%2B'
  applyStyle(layer, getSinkStyleDef('public.cspkarst_sink', pgTileservUrl, '5%2B'))
  return {
    id: layerId,
    name: 'Sinks (depth: 5+ ft)',
    visible: false,
    info: '<img src="/static/img/sink-layer-legend.png" style="width:140px;" />',
    layer: layer,
  }
}

function fracLineLayer(pgTileservUrl) {
  const layerId = 'frac';
  const layer = new VectorTileLayer({
    id: layerId,
    declutter: false,
    zIndex: 30,
  })
  applyStyle(layer, {
    version: 8,
    sources: {
      fracture_lines: {
        type: "vector",
        tiles: [
          pgTileservUrl + "public.cspkarst_fractureline/{z}/{x}/{y}.pbf",
        ]
      }
    },
    layers: [
      {
        id: 'public.cspkarst_fractureline',
        source: "fracture_lines",
        'source-layer': 'public.cspkarst_fractureline',
        type: "line",
        paint: {
          'line-color': "#aa3333",
          'line-width': 3,
        },
      }
    ]  
  });
  return {
    id: layerId,
    name: 'Fracture Lines',
    visible: false,
    layer: layer,
    visible: false
  }
}

// CIVIL LAYER SECTION
function countyLayer(pgTileservUrl) {
  const layerId = 'counties';
  const layer = new VectorTileLayer({
    id: layerId,
    declutter: false,
    zIndex: 28,
  })
  applyStyle(layer, {
    version: 8,
    sources: {
      reference_layers_county: {
        type: "vector",
        tiles: [
          pgTileservUrl + "public.reference_layers_county/{z}/{x}/{y}.pbf",
        ]
      }
    },
    layers: [
      {
        id: 'public.reference_layers_county',
        source: "reference_layers_county",
        'source-layer': 'public.reference_layers_county',
        type: "line",
        paint: {
          'line-color': "#000000",
          'line-width': 2,
        },
      }
    ]  
  });
  return {
    id: layerId,
    name: 'Counties',
    visible: true,
    layer: layer,
  }
}

function mcdLayer(pgTileservUrl) {
  const cvLyr = new VectorTileLayer({declutter: false})
  applyStyle(cvLyr, {
    version: 8,
    sources: {
      reference_layers_minorcivildivision: {
        type: "vector",
        tiles: [
          pgTileservUrl + "public.reference_layers_minorcivildivision/{z}/{x}/{y}.pbf",
        ]
      }
    },
    layers: [
      {
        id: 'public.reference_layers_minorcivildivision',
        source: "reference_layers_minorcivildivision",
        'source-layer': 'public.reference_layers_minorcivildivision',
        type: "line",
        filter: ['any', ["==", ["get", "ctv"], "C"], ["==", ["get", "ctv"], "V"]],
        paint: {
          'line-color': "#ffe310",
          'line-width': 2,
        },
      },
    ]
  });
  const townLyr = new VectorTileLayer({declutter: false})
  applyStyle(townLyr, {
    version: 8,
    sources: {
      reference_layers_minorcivildivision: {
        type: "vector",
        tiles: [
          pgTileservUrl + "public.reference_layers_minorcivildivision/{z}/{x}/{y}.pbf",
        ]
      }
    },
    layers: [
      {
        id: 'public.reference_layers_minorcivildivision',
        source: "reference_layers_minorcivildivision",
        'source-layer': 'public.reference_layers_minorcivildivision',
        type: "line",
        filter: ["==", ["get", "ctv"], "T"],
        paint: {
          'line-color': "#ff7a06",
          'line-width': 2,
        },
      },
    ]
  });
  const layerId = 'mcd';
  const layerGroup = new LayerGroup({
    id: layerId,
    layers: [townLyr, cvLyr],
    zIndex: 27,
  })
  return {
    id: layerId,
    name: 'Minor Civil Divisions',
    visible: true,
    layer: layerGroup,
  }
}

function twpLayer(pgTileservUrl) {
  const layerId = 'townships';
  const layer = new VectorTileLayer({
    id: layerId,
    declutter: false,
    zIndex: 25,
  })
  applyStyle(layer, {
    version: 8,
    sources: {
      reference_layers_plsstownship: {
        type: "vector",
        tiles: [
          pgTileservUrl + "public.reference_layers_plsstownship/{z}/{x}/{y}.pbf",
        ]
      }
    },
    layers: [
      {
        id: 'public.reference_layers_plsstownship',
        source: "reference_layers_plsstownship",
        'source-layer': 'public.reference_layers_plsstownship',
        type: "line",
        paint: {
          'line-color': "#000000",
          'line-width': 1,
        },
      }
    ]  
  });
  return {
    id: layerId,
    name: 'PLSS Townships',
    visible: false,
    layer: layer,
  }
}

function secLayer(pgTileservUrl) {
  const layerId = 'sections';
  const layer = new VectorTileLayer({
    id: layerId,
    declutter: false,
    zIndex: 24,
  })
  applyStyle(layer, {
    version: 8,
    sources: {
      reference_layers_plsssection: {
        type: "vector",
        tiles: [
          pgTileservUrl + "public.reference_layers_plsssection/{z}/{x}/{y}.pbf",
        ]
      }
    },
    layers: [
      {
        id: 'public.reference_layers_plsssection',
        source: "reference_layers_plsssection",
        'source-layer': 'public.reference_layers_plsssection',
        type: "line",
        paint: {
          'line-color': "#000000",
          'line-width': .5,
        },
      }
    ]  
  });
  return {
    id: layerId,
    name: 'PLSS Sections',
    visible: false,
    layer: layer,
  }
}

function qsecLayer(pgTileservUrl) {
  const layerId = 'qsections';
  const layer = new VectorTileLayer({
    id: layerId,
    declutter: false,
    zIndex: 23,
  })
  applyStyle(layer, {
    version: 8,
    sources: {
      reference_layers_plssquartersection: {
        type: "vector",
        tiles: [
          pgTileservUrl + "public.reference_layers_plssquartersection/{z}/{x}/{y}.pbf",
        ]
      }
    },
    layers: [
      {
        id: 'public.reference_layers_plssquartersection',
        source: "reference_layers_plssquartersection",
        'source-layer': 'public.reference_layers_plssquartersection',
        type: "line",
        paint: {
          'line-color': "#000000",
          'line-width': .25,
          'line-dasharray': [2, 4],
        },
      }
    ]  
  });
  return {
    id: layerId,
    name: 'PLSS ¼ Sections',
    visible: false,
    layer: layer,
  }
}



// const mcdLayer2 = new TileLayer({
//   zIndex: 26,
//   id: "mcd",
//   source: new TileWMS({
//     url: "https://gn.legiongis.com/geoserver/ows",
//     params: {
//       LAYERS: 'general:cities_towns_and_villages',
//       TILED: true,
//       CQL_FILTER: "cnty_name IN ('CRAWFORD','VERNON','IOWA','GRANT','RICHLAND','LAFAYETTE')"
//     },
//   }),
//   attributions: "Minor Civil Divisions (Fall 2017)",
// })
// const countyLayer = new TileLayer({
//   zIndex: 27,
//   id: "counties",
//   source: new TileWMS({
//     url: "https://gn.legiongis.com/geoserver/ows",
//     params: {
//       LAYERS: 'general:wi_counties_nrcs_4269',
//       TILED: true,
//       CQL_FILTER: "countyname IN ('Crawford','Vernon','Iowa','Grant','Richland','Lafayette')",
//     },
//   }),
//   attributions: "Counties <a href='https://gdg.sc.egov.usda.gov/' target='_blank'>NRCS</a>",
// })

// const qsectionsLayer = new TileLayer({
//   id: "plss_qsections",
//   zIndex: 23,
//   source: new TileWMS({
//     url: "https://gn.legiongis.com/geoserver/ows",
//     params: {
//       'LAYERS': 'general:plss_qsections',
//       'TILED': true,
//     },
//   })
// })
// const sectionsLayer = new TileLayer({
//   id: "plss_sections",
//   zIndex: 23,
//   source: new TileWMS({
//     url: "https://gn.legiongis.com/geoserver/ows",
//     params: {
//       'LAYERS': 'general:plss_sections',
//       'TILED': true,
//     },
//   })
// })
// const townshipsLayer = new TileLayer({
//   id: "townships",
//   zIndex: 30,
//   source: new TileWMS({
//     url: "https://gn.legiongis.com/geoserver/ows",
//     params: {
//       'LAYERS': 'general:plss_townships',
//       'TILED': true,
//     },
//   })
// })


// NATURAL LAYER SECTION

// const carbLayer = new TileLayer({
//   id: "carbonate",
//   zIndex: 21,
//   opacity: .7,
//   source: new TileWMS({
//     url: "https://gn.legiongis.com/geoserver/ows",
//     params: {
//       'LAYERS': 'general:geology_a_wi_usgs_2005',
//       'TILED': true,
//       'STYLES': 'geology_carbonate_wi'
//     },
//   })
// })
function carbonateLayer(apiKey) {
  const layerId = 'carbonate';
  return {
    id: layerId,
    name: "Carbonate Bedrock",
    layer: new TileLayer({
      id: layerId,
      source: new XYZ({
        url: 'https://api.mapbox.com/styles/v1/legiongis/clh6rrh0l01hd01qndmio9c4o/tiles/256/{z}/{x}/{y}?access_token=' + apiKey,
        // tileSize: 512,
        // resolution: 1,
      }),
      opacity: .7,
      zIndex: 21,
    }),
    visible: false,
    info: '<img src="/static/img/carbonate-bedrock-legend.png" style="width:140px" />',
  };
};
function depthToBedrockLayer(apiKey) {
  const layerId = 'bedrockDepth';
  return {
    id: layerId,
    name: "Depth to Bedrock",
    layer: new TileLayer({
      id: layerId,
      source: new XYZ({
        url: 'https://api.mapbox.com/styles/v1/legiongis/clh6siyim01hf01qn6iv4a6wn/tiles/256/{z}/{x}/{y}?access_token=' + apiKey,
        // tileSize: 512,
        // resolution: 1,
      }),
      opacity: .7,
      zIndex: 22,
    }),
    visible: false,
    info: '<img src="/static/img/depth-to-bedrock-legend.png" style="width:140px" />',
  };
};
// const depthLayer = new TileLayer({
//   id: "bedrockDepth",
//   zIndex: 22,
//   opacity: .7,
//   source: new TileWMS({
//     url: "https://gn.legiongis.com/geoserver/ows",
//     params: {
//       'LAYERS': 'karstography:Crawford_Depth_to_Bedrock',
//       'TILED': true,
//     },
//   })
// })

function huc8Layer(pgTileservUrl) {
  const layerId = 'huc8layer';
  const layer = new VectorTileLayer({
    id: layerId,
    declutter: false,
    zIndex: 23,
  })
  applyStyle(layer, {
    version: 8,
    sources: {
      reference_layers_hydrologicunit: {
        type: "vector",
        tiles: [
          pgTileservUrl + "public.reference_layers_hydrologicunit/{z}/{x}/{y}.pbf?filter=category%20=%20'Subbasin'",
        ]
      }
    },
    layers: [
      {
        id: 'public.reference_layers_hydrologicunit',
        source: "reference_layers_hydrologicunit",
        'source-layer': 'public.reference_layers_hydrologicunit',
        type: "line",
        paint: {
          'line-color': "#6B1824",
          'line-width': 2.25,
        },
      }
    ]
  });
  return {
    id: layerId,
    name: 'Subbasins (HUC8)',
    visible: false,
    layer: layer,
  }
}

function huc10Layer(pgTileservUrl) {
  const layerId = 'huc10layer';
  const layer = new VectorTileLayer({
    id: layerId,
    declutter: false,
    zIndex: 23,
  })
  applyStyle(layer, {
    version: 8,
    sources: {
      reference_layers_hydrologicunit: {
        type: "vector",
        tiles: [
          pgTileservUrl + "public.reference_layers_hydrologicunit/{z}/{x}/{y}.pbf?filter=category%20=%20'Watershed'",
        ]
      }
    },
    layers: [
      {
        id: 'public.reference_layers_hydrologicunit',
        source: "reference_layers_hydrologicunit",
        'source-layer': 'public.reference_layers_hydrologicunit',
        type: "line",
        paint: {
          'line-color': "#9E2335",
          'line-width': 1.5,
        },
      }
    ]
  });
  return {
    id: layerId,
    name: 'Watersheds (HUC10)',
    visible: false,
    layer: layer,
  }
}

function huc12Layer(pgTileservUrl) {
  const layerId = 'huc12layer';
  const layer = new VectorTileLayer({
    id: layerId,
    declutter: false,
    zIndex: 23,
  })
  applyStyle(layer, {
    version: 8,
    sources: {
      reference_layers_hydrologicunit: {
        type: "vector",
        tiles: [
          pgTileservUrl + "public.reference_layers_hydrologicunit/{z}/{x}/{y}.pbf?filter=category%20=%20'Subwatershed'",
        ]
      }
    },
    layers: [
      {
        id: 'public.reference_layers_hydrologicunit',
        source: "reference_layers_hydrologicunit",
        'source-layer': 'public.reference_layers_hydrologicunit',
        type: "line",
        paint: {
          'line-color': "#EA344F",
          'line-width': .75,
        },
      },
    ]
  });
  return {
    id: layerId,
    name: 'Subwatersheds (HUC12)',
    visible: false,
    layer: layer,
  }
}

// POI/EXAMPLES LAYER
function poiLayer(geojson) {

  return {
    name: "Examples",
    id: 'pois',
    layer: new VectorLayer({
      zIndex: 5000,
      id: 'pois',
      source: new VectorSource({
        features: new GeoJSON().readFeatures(geojson),
      }),
      style: styleDefs.poiStyle,
    }),
    visible:false,   
  }
}

export class LayerDefs {

  labelLayer = function(apiKey) {
    return outdoorsLabels(apiKey)
  }

  baseLayers = function(apiKey, titilerUrl) {
    return [
      mapboxOutdoors(apiKey),
      mapboxAerial(apiKey),
      hillshade(titilerUrl),
      usgsTopo(titilerUrl),
      crawfordTPI(titilerUrl),
    ]
  }

  karstLayers = function(pgTileservUrl) {
    return [
      wellsLayer(pgTileservUrl),
      sinkholesLayer(pgTileservUrl),
      sinkholeHeatmapLayer(),
      sinks12Layer(pgTileservUrl),
      sinks25Layer(pgTileservUrl),
      sinks5Layer(pgTileservUrl),
      fracLineLayer(pgTileservUrl),
    ]
  }

  civilLayers = function(pgTileservUrl) {
    return [
      // {
      //   name:"Minor Civil Divisions",
      //   id: mcdLayer.get('id'),
      //   layer: mcdLayer, visible: true
      // },
      // {
      //   name:"Counties",
      //   id: countyLayer.get('id'),
      //   layer: countyLayer,
      //   visible: false
      // },
      mcdLayer(pgTileservUrl),
      countyLayer(pgTileservUrl),
      // {
      //   name:"PLSS ¼ Sections",
      //   id: qsectionsLayer.get('id'),
      //   layer: qsectionsLayer, 
      //   visible: false
      // },
      twpLayer(pgTileservUrl),
      secLayer(pgTileservUrl),
      qsecLayer(pgTileservUrl),
      // {
      //   name:"PLSS Sections",
      //   id: sectionsLayer.get('id'),
      //   layer: sectionsLayer,
      //   visible: false
      // },
      // {
      //   name:"PLSS Townships",
      //   id: townshipsLayer.get('id'),
      //   layer: townshipsLayer,
      //   visible: false
      // },
    ]
  }

  naturalLayers = function(pgTileservUrl, apiKey) {
    return [
      // {
      //   name:"Carbonate Bedrock",
      //   id: carbLayer.get('id'),
      //   layer: carbLayer,
      //   visible: false,
      //   info: '<img src="/static/img/carbonate-bedrock-legend.png" style="width:140px" />'
      // },

      carbonateLayer(apiKey),
      depthToBedrockLayer(apiKey),
      huc8Layer(pgTileservUrl),
      huc10Layer(pgTileservUrl),
      huc12Layer(pgTileservUrl),
    ]
  }

  poiLayer = function(geojson) {
    return poiLayer(geojson)
  }
}
