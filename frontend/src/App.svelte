<script>
import { onMount } from 'svelte';

import Map from 'ol/Map';
import View from 'ol/View';

import {fromLonLat, toLonLat} from 'ol/proj';
import Overlay from 'ol/Overlay';

import {Attribution, Zoom, ScaleLine} from 'ol/control';

import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

import {MouseWheelZoom, defaults} from 'ol/interaction';

import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';

import {toStringHDMS} from 'ol/coordinate';

import sync from 'ol-hashed';

import {LayerDefs, styleDefs} from './js/utils';
    import Navbar from './components/Navbar.svelte';
    import Modals from './components/Modals.svelte';
    import LayerPanel from './components/LayerPanel.svelte';
    import ExamplePanel from './components/ExamplePanel.svelte';
    import SinkPanel from './components/SinkPanel.svelte';

const layerDefs = new LayerDefs();

export let CONTEXT

let showLayerPanel = false;
let showSinkPanel = false;
let showExamplePanel = false;
let showAboutModal = true;

let container;
let content;
let closer;
let overlay;

let currentSink = null;

let poiList = [];
const poiLayer = layerDefs.poiLayer(CONTEXT.examples_geojson)
$: {
    if (showExamplePanel) {
        poiList = [];
        poiLayer.layer.setVisible(true)
        poiLayer.layer.getSource().getFeatures().forEach(function(feature) {
            poiList.push(feature)
        })
    } else {
        poiLayer.layer.setVisible(false)
    }
}

function zoomToPoi(pk) {
    poiLayer.layer.getSource().getFeatures().forEach(function(feature) {
        if (pk == feature.getProperties().pk) {
            viewer.map.getView().setCenter(feature.getGeometry().getFlatCoordinates())
            viewer.map.getView().setZoom(19);
        }
    })
}

// This object holds the visibility boolean for each overlay layer, and these values
// are bound to the checkbox for each layer. when a checkbox is changed it changes
// a value in this object, which in turn triggers the function below to turn on or
// off each layer as needed.
let overlayVisible = {}
$:  if (viewer) {
    viewer.map.getLayers().forEach( function(layer) {
        if (layer.get('id') in overlayVisible){
            layer.setVisible(overlayVisible[layer.get('id')])
        } 
    })
}

let showLabelLayer = true;
const labelsLayer = layerDefs.labelLayer(CONTEXT.mapbox_api_key);
$: {
    labelsLayer.layer.setVisible(showLabelLayer)
}

let currentBasemap = 'hillshade';
const baseLayers = layerDefs.baseLayers(CONTEXT.mapbox_api_key, CONTEXT.titiler_url);
function setBasemap(layerId) {
    baseLayers.forEach( function(layerObj) {
        layerObj.layer.setVisible(layerObj.id == layerId);
    });
}
$: setBasemap(currentBasemap);

const karstLayers = layerDefs.karstLayers(CONTEXT.pg_tileserv_url)
karstLayers.forEach( function (layerObj) {
    layerObj.layer.setVisible(layerObj.visible);
    overlayVisible[layerObj.id] = layerObj.layer.getVisible();
});

const civilLayers = layerDefs.civilLayers(CONTEXT.pg_tileserv_url)
civilLayers.forEach( function (layerObj) {
    layerObj.layer.setVisible(layerObj.visible);
    overlayVisible[layerObj.id] = layerObj.layer.getVisible();
});

const naturalLayers = layerDefs.naturalLayers(CONTEXT.pg_tileserv_url, CONTEXT.mapbox_api_key)
naturalLayers.forEach( function (layerObj) {
    layerObj.layer.setVisible(layerObj.visible);
    overlayVisible[layerObj.id] = layerObj.layer.getVisible();
});

const overlayGroups = [
    {name: "Karst-related Layers", layers: karstLayers},
    {name: "Civil Layers", layers: civilLayers},
    {name: "Natural Layers", layers: naturalLayers},
]

let currentZoom;

function MapView() {

    container = document.getElementById('popup');
    content = document.getElementById('popup-content');
    closer = document.getElementById('popup-closer');
    overlay = new Overlay({
        element: container,
        autoPan: {
            animation: {
            duration: 250,
            },
        },
    });

    const map = new Map({
        target: 'karstmap',
        view: new View({
            center: fromLonLat([-90.9201, 43.22219]),
            zoom: 10,
        }),
        controls: [
            new Attribution(),
            new ScaleLine({units: 'us'}),
            new Zoom(),
        ],
        overlays: [overlay],
        interactions: defaults({mouseWheelZoom: false}).extend([
            new MouseWheelZoom({
                constrainResolution: true,
            }),
        ]),
        maxTilesLoading: 32,
    });

    const highlightLayer = new VectorLayer({
        source: new VectorSource(),
        style: styleDefs.highlight,
        zIndex: 100,
    })

    const selectedLayer = new VectorLayer({
        source: new VectorSource(),
        style: styleDefs.selected,
        zIndex: 100,
    })

    map.addLayer(selectedLayer)
    map.addLayer(highlightLayer)
    map.addLayer(poiLayer.layer)

    const highlightLayers = [
        'public.cspkarst_sink',
        'public.cspkarst_sink_12',
        'public.cspkarst_sink_25',
        'public.cspkarst_sink_5',
        'public.cspkarst_well',
    ]
    map.on('pointermove', function (event) {
        highlightLayer.getSource().clear()
        let hit = false;
        map.forEachFeatureAtPixel(
            event.pixel,
            function (feature) {
                if (hit) return // only hover on one point at a time
                highlightLayer.getSource().clear();
                if (highlightLayers.indexOf(feature.getProperties().layer) >= 0) {
                    hit = true;
                    // source.addFeature(new Feature(fromExtent(feature.getGeometry().getExtent())));
                    highlightLayer.getSource().addFeature(new Feature(new Point(feature.getFlatCoordinates())));
                }
            },
            {
            hitTolerance: 2,
            }
        );
        if (!hit) {document.body.style.cursor = 'default'} else {document.body.style.cursor = 'pointer'}
    });
    map.on('moveend', function(event) {
        const newZoom = map.getView().getZoom()
        if (newZoom != currentZoom) {
            currentZoom = newZoom;
        };
    });

    
    closer.onclick = function () {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };
    const popupLayers = [
        'public.cspkarst_well',
        'public.cspkarst_sink',
        'public.cspkarst_sink_12',
        'public.cspkarst_sink_25',
        'public.cspkarst_sink_5',
    ]
    map.on('singleclick', function (event) {
        let hit = false;
        map.forEachFeatureAtPixel(
            event.pixel,
            function (feature) {
                if (hit) return // only hover on one point at a time
                const props = feature.getProperties();
                if (popupLayers.indexOf(props.layer) >= 0) {
                    hit = true;
                    let popupContent = 'none';
                    if (props.layer == 'public.cspkarst_well') {
                        const wcrDownloadUrl = "https://apps.dnr.wi.gov/wellconstructionpub/ReportViewer.aspx?id=WellConstructionReport&download=false&WUWN="
                        const grnWellDetails = "https://dnr.wi.gov/GRNext/WellInventory/Details/"
                        popupContent = `
                            <h4>WELL ID: ${props.wi_unique_well_no}</h4>
                            <p>
                            <a href="${wcrDownloadUrl}${props.wi_unique_well_no}" target="_blank">View Well Construction Report <i class="fa fa-external-link"></i></a><br>
                            <a href="${grnWellDetails}${props.wi_unique_well_no}" target="_blank">View in GRN <i class="fa fa-external-link"></i></a><br>
                            <span>This point location is based on: ${props.location_method}
                            </p>
                        `
                        content.innerHTML = popupContent;
                        overlay.setPosition(feature.getFlatCoordinates());
                        selectedLayer.getSource().clear();
                        selectedLayer.getSource().addFeature(new Feature(new Point(feature.getFlatCoordinates())));
                    } else if (popupLayers.indexOf(props.layer) >= 0) {
                        showSinkPanel = true;
                        currentSink = props;
                        selectedLayer.getSource().clear();
                        selectedLayer.getSource().addFeature(new Feature(new Point(feature.getFlatCoordinates())));
                    }
                }
            },
            {
            hitTolerance: 2,
            }
        );
        if (!hit) {
            selectedLayer.getSource().clear();
            currentSink = null;
        }
    });

    map.addLayer(labelsLayer.layer)
    baseLayers.forEach(function (layerObj) { map.addLayer(layerObj.layer); })
    karstLayers.forEach(function (layerObj) { map.addLayer(layerObj.layer); })
    civilLayers.forEach(function (layerObj) { map.addLayer(layerObj.layer); })
    naturalLayers.forEach(function (layerObj) { map.addLayer(layerObj.layer); })

    this.map = map;
};

let viewer;
onMount(() => {
    viewer = new MapView();
    sync(viewer.map);
})
</script>

<main>
    <Modals bind:showAboutModal />
    <Navbar
        environment={CONTEXT.environment}
        user={CONTEXT.user}
        bind:showLayerPanel
        bind:showSinkPanel
        bind:showExamplePanel
        bind:showAboutModal
    />
    <SinkPanel
        bind:visible={showSinkPanel}
        {currentSink}
    />
    <LayerPanel
        bind:visible={showLayerPanel}
        bind:showLabelLayer
        bind:currentBasemap
        bind:overlayVisible
        {baseLayers}
        {overlayGroups}
    />
    <ExamplePanel
        bind:visible={showExamplePanel}
        {zoomToPoi}
        {poiList}
    />
    <div id="karstmap" class="map"></div>
    <div id="popup" class="ol-popup" style="">
        <a href="#" title="Close popup" id="popup-closer" class="ol-popup-closer"></a>
        <div id="popup-content"></div>
    </div>
</main>

<style>

#karstmap {
    height: calc(100% - 2em);
    width: 100%;
    position: fixed;
    top: 2em;
    z-index: 0;
    background-color: #dddddd
}

.ol-popup {
    position: absolute;
    background-color: white;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    bottom: 12px;
    left: -50px;
    min-width: 280px;
    z-index: 1000000000;
}
.ol-popup:after, .ol-popup:before {
    top: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
}
.ol-popup:after {
    border-top-color: white;
    border-width: 10px;
    left: 48px;
    margin-left: -10px;
}
.ol-popup:before {
    border-top-color: #cccccc;
    border-width: 11px;
    left: 48px;
    margin-left: -11px;
}
.ol-popup-closer {
    text-decoration: none;
    position: absolute;
    top: 2px;
    right: 8px;
}
.ol-popup-closer:after {
    content: "✖";
}
</style>
