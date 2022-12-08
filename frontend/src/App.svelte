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

const layerDefs = new LayerDefs();

export let USER;
export let MAPBOX_API_KEY;
export let PG_TILESERV_URL;
export let EXAMPLES_GEOJSON;
export let ENVIRONMENT;

let showLayerPanel = false;
let showSinkPanel = false;
let showInstructions = false;
let showExamplePanel = false;
let showAboutModal = true;

let container;
let content;
let closer;
let overlay;

let disableInput = true;
let currentSink = null;

let poiList = [];
const poiLayer = layerDefs.poiLayer(EXAMPLES_GEOJSON)
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
const overlayVisible = {}
$:  if (viewer) {
    viewer.map.getLayers().forEach( function(layer) {
        if (layer.get('id') in overlayVisible){
            layer.setVisible(overlayVisible[layer.get('id')])
        } 
    })
}

let showLabelLayer = true;
const labelsLayer = layerDefs.labelLayer(MAPBOX_API_KEY);
$: {
    labelsLayer.layer.setVisible(showLabelLayer)
}

let currentBasemap = 'hillshade';
const baseLayers = layerDefs.baseLayers(MAPBOX_API_KEY);
function setBasemap(layerId) {
    baseLayers.forEach( function(layerObj) {
        layerObj.layer.setVisible(layerObj.id == layerId);
    });
}
$: setBasemap(currentBasemap);

const karstLayers = layerDefs.karstLayers(PG_TILESERV_URL)
karstLayers.forEach( function (layerObj) {
    layerObj.layer.setVisible(layerObj.visible);
    overlayVisible[layerObj.id] = layerObj.layer.getVisible();
});

const civilLayers = layerDefs.civilLayers()
civilLayers.forEach( function (layerObj) {
    layerObj.layer.setVisible(layerObj.visible);
    overlayVisible[layerObj.id] = layerObj.layer.getVisible();
});

const naturalLayers = layerDefs.naturalLayers()
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
                        const grnWellDetails = "https://dnr.wi.gov/GRNext/WellInventory/Details/"
                        popupContent = `
                            <h4>WELL ID: ${props.wi_unique_well_no}</h4>
                            <p>
                            <a href="${props.well_constr_url}" target="_blank">View Well Construction Report <i class="fa fa-external-link"></i></a><br>
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

function toggleInfo(layerid) {
    const disp = document.getElementById(layerid+"-info").style.display
    document.getElementById(layerid+"-info").style.display = disp == "flex" ? "none" : "flex";
}

</script>

<main>
    {#if showAboutModal}
    <div class="modal-background" on:click={() => {showAboutModal=!showAboutModal}} on:keypress={() => {showAboutModal=!showAboutModal}}>
        <div class="modal-content">
            <h2>Welcome</h2>
            <p>The <em>Karst Geology Viewer</em> is a creation of the <a href="https://crawfordstewardship.org" target="_blank">Crawford Stewardship Project</a> to map and explore the geology of southwestern Wisconsin.</p>
            <p><a href="/about" target="_blank">learn more</a></p>
            <button>Close</button>
        </div>
    </div>
    {/if}
    {#if showSinkPanel}
    <div id="info-panel" class="input-form-panel" style="display:flex; flex-direction:column;">
        <div style="display:flex; justify-content:left; min-height:2em;">
            <button class="link-button" on:click={() => {showSinkPanel=!showSinkPanel}}><i style="font-size:1.25em" class="fa fa-times-circle-o"></i></button>
        </div>
        <div>
            <p><strong>hello neighbor! let's evaluate algorithmically-derived sinks...</strong></p>
            <p style="color:red;"><em>This operation is currently disabled.</em></p>
        </div>
        <div>
            <p><button on:click={() => {showInstructions=!showInstructions}}>show desktop assessment instructions</button></p>
            {#if showInstructions}
            <div id="instructions">
                <ol style="padding-left:15px;">
                    <li>make sure the appropriate "Sink" layer (1-2 ft, 2-5 ft, or 5+ ft) is activated (use layers panel, top right)</li>
                    <li>zoom in and click on a sink point</li>
                    <ol>
                        <li>categorize the sink</li>
                        <li>check the box for each basemap you use</li>
                        <li>select a confidence level (only necessary for Sinkholes)</li>
                    </ol>
                    <li>click <strong>Submit</strong>, and the color will change</li>
                    <li>find another sink and start again!</li>
                </ol>
            </div>
            {/if}
        </div>
        {#if currentSink}
        <div class="sink-update-section">
            <div class="sink-update-header">
                Sink ID: {currentSink.id} | Elev: {currentSink.elevation} | Depth: {currentSink.depth}
            </div>
            <div class="sink-update-content">
                <div title="Category for this sink, based on the assessments described below.">
                    Sink category: <select disabled={disableInput} bind:value={currentSink.sink_type}>.
                        <option>SINKHOLE</option>
                        <option>CATCHMENT</option>
                    </select>
                </div>
                {#if currentSink.sink_type == "SINKHOLE"}
                <div>
                    <label>
                        Sinkhole Confidence Level: <select disabled={disableInput} bind:value={currentSink.confidence}>
                            <option value="">--</option>
                            <option class="POSSIBLE">POSSIBLE</option>
                            <option>PROBABLE</option>
                        </select>
                    </label>
                    <label title="Check this box only if a field assessment has taken place.">
                        <input disabled={disableInput} type="checkbox" bind:checked={currentSink.field_chk}  />
                        Field Checked?
                    </label>
                </div>
                {/if}
                <hr>
                <div>
                    <p>Basemaps used during desktop assessment:</p>
                    <label title="Check this box if you consulted the Hillshade basemap for your assessment.">
                        <input disabled={disableInput} type="checkbox" bind:checked={currentSink.bm_hs}  />
                        Hillshade
                    </label>
                    <label title="Check this box if you consulted the Aerial Imagery basemap for your assessment.">
                        <input disabled={disableInput} type="checkbox" bind:checked={currentSink.bm_aerial}  />
                        Aerial Imagery
                    </label>
                    <label title="Check this box if you consulted the USGS Topo basemap for your assessment.">
                        <input disabled={disableInput} type="checkbox" bind:checked={currentSink.bm_usgs}  />
                        USGS
                    </label>
                    <label title="Check this box if you consulted the Topographic Position Index basemap for your assessment.">
                        <input disabled={disableInput} type="checkbox" bind:checked={currentSink.bm_tpi}  />
                        TPI
                    </label>
                </div>
                <hr>
                <div>
                    <label title="Check this box only if a field assessment has taken place.">
                        Comment <br><input disabled={disableInput} bind:value={currentSink.comment}  />
                    </label>
                </div>
            </div>
        </div>
        {/if}
    </div>
    {/if}
    {#if showLayerPanel }
    <div id="layer-panel">
        <div style="display:flex; justify-content:right; min-height:2em;">
            <button class="link-button" on:click={() => {showLayerPanel=!showLayerPanel}}><i style="font-size:1.25em" class="fa fa-times-circle-o"></i></button>
        </div>
        <div class="layer-group">
            <h3 class="layer-group-header">Basemaps</h3>
            <div class="layer-item">
                <label>
                    <input id="outdoors_labels" type=checkbox bind:checked={showLabelLayer}>
                    <span><em>show road labels</em></span>
                </label>
            </div>
            {#each baseLayers as layer}
            <div class="layer-item">
                <div>
                    <label><input type=radio bind:group={currentBasemap} value={layer.id} checked={currentBasemap == layer.id}>{layer.name}</label>
                    {#if layer.info}<i on:click={() => {toggleInfo(layer.id)}} on:keypress={() => {toggleInfo(layer.id)}} class="fa fa-info-circle layer-info-icon"></i>{/if}
                </div>
                {#if layer.info}
                <div id="{layer.id}-info" class="layer-info">
                    {@html layer.info}
                </div>
                {/if}
            </div>
            {/each}
        </div>
        {#each overlayGroups as overlayGroup}
        <div class="layer-group">
            <h3 class="layer-group-header">{overlayGroup.name}</h3>
            {#each overlayGroup.layers as layer}
            <div class="layer-item">
                <div>
                    <label><input type=checkbox bind:checked={overlayVisible[layer.id]}>{layer.name}</label>
                    {#if layer.info}<i on:click={() => {toggleInfo(layer.id)}} on:keypress={() => {toggleInfo(layer.id)}} class="fa fa-info-circle layer-info-icon"></i>{/if}
                </div>
                {#if layer.info}
                <div id="{layer.id}-info" class="layer-info">
                    {@html layer.info}
                </div>
                {/if}
            </div>
            {/each}
        </div>
        {/each}
        <div class="layer-group">
            <p><em>not all layers have the same coverage extent</em></p>
        </div>
    </div>
    {/if}
    {#if showExamplePanel }
    <div class="example-bottom-panel">
        <div style="width: 25%">
            <p style="margin-bottom:5px;"><a class="save-location" href="javascript:void(0)">bookmark current view</a><br><em>do this before zooming to an example</em>
            </p>
        </div>
        <div class="poi-list" style="width: 70%">
            {#each poiList as poi}
            <button on:click={() => {zoomToPoi(poi.getProperties().pk)}}>{poi.getProperties().name}</button>
            {/each}
        </div>
        <div style="width: 5%">
            <button class="link-button" on:click={() => {showExamplePanel=!showExamplePanel}}><i style="font-size:1.25em" class="fa fa-times-circle-o"></i></button>
        </div>
    </div>
    {/if}
    <div id="navbar">
        <div>
            <button class="link-button" on:click={() => {showSinkPanel=!showSinkPanel}}>sink evaluation</button> |
            <button class="link-button" on:click={() => {showExamplePanel=!showExamplePanel}}>examples</button>
        </div>
        <div>
            {#if ENVIRONMENT == "staging"}<span style="color:red">¡Staging Server!</span>{/if}
            <h1 style="display:inline;">Karst Geology Viewer</h1>
            {#if ENVIRONMENT == "staging"}<span style="color:red">¡Staging Server!</span>{/if}
            {#if USER.username}&nbsp;| <span>{USER.username}</span>{/if}</div>
        <div>
            {#if USER.username}
            <button class="link-button" onclick="window.location.href='/logout?next=/'">logout</button> |
            {:else}
            <button class="link-button" onclick="window.location.href='/login?next=/'">login</button> |
            {/if}
            <button class="link-button" on:click={() => {showAboutModal=!showAboutModal}}>about</button> |
            <button class="link-button" on:click={() => {showLayerPanel=!showLayerPanel}}>layers</button>
        </div>
    </div>
    <div id="karstmap" class="map"></div>
    <div id="popup" class="ol-popup" style="">
        <a href="#" title="Close popup" id="popup-closer" class="ol-popup-closer"></a>
        <div id="popup-content"></div>
    </div>
</main>

<style>

.modal-background {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    height: 100%;
    width: 100%;
    background: rgba(255,255,255,.5);
    z-index: 2000000;
}
.modal-content {
    border-radius: 4px;
    width: 300px;
    background: white;
    box-shadow: 0px 0px 10px 2px #000000;
    text-align:center;
    margin: 10px;
    padding: 10px;
    font-size: .9em;
}

.modal-content h2 {
    margin: 10px;
}

#karstmap {
    height: calc(100% - 2em);
    width: 100%;
    position: fixed;
    top: 2em;
    z-index: 0;
    background-color: #dddddd
}

#navbar {
    min-height:2em;
    display:flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    width: 100%;
    min-height: 2em;
    background-color: #85BF6F;
    box-shadow: 0px 0px 10px 2px #003300;
    color: #003300;
    z-index: 2000;
    font-weight: 900;
}

#navbar div button {
    font-weight:900;
}

#navbar div {
    padding: 0px 10px;
    text-align: center;
}

#navbar div h1 {
    margin: 0;
    font-size: 1.25em;
}

.link-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0px;
    font-family: inherit;
    font-size: 1em;
}

.link-button:hover {
    text-decoration: underline;
}

#layer-panel {
    display: flex;
    flex-direction: column;
    z-index: 3000;
    height: 100vh;
    top:0;
    right:0;
    background-color:#96BEF1;
    position:absolute;
    box-shadow: 0px 0px 10px 2px #182F4C;
    max-width: 100%;
    padding: 0px 10px;
    overflow-y:auto;
}

.layer-group {
    display: flex;
    flex-direction: column;
    padding-left: 6px;
}

.layer-item {
display: flex;
flex-direction: column;
  font-size: 1.2em;
  display: inline;
  margin-bottom: 2px;
}

.layer-info-icon {
    cursor: pointer;
}

.layer-info {
    display: none;
    padding-left: 10px;
}

.layer-group-header {
  margin-bottom: 4px;
  margin-top: 8px;
}

.layer-group {
  padding: 7px;
}

select.POSSIBLE, option[value="POSSIBLE"] {
    color: white;
    background:black
}

.input-form-panel {
    z-index: 2147483646 !important;
    height: 100vh;
    top:0;
    background-color:#ffe78f;
    position:absolute;
    box-shadow: 0px 0px 10px 2px #182F4C;
    width: 300px;
    overflow-y:auto;
    padding: 0px 10px;
}

.sink-update-content div {
    display:flex;
    flex-direction:column;
    padding: 0px 10px;
}

.example-bottom-panel {
    display: flex;
    z-index: 2147483647 !important;
    bottom:0;
    background-color:#ff9f8f;
    position:absolute;
    box-shadow: 0px 0px 10px 2px #182F4C;
    height: 90px;
    padding: 10px;
}

.example-bottom-panel a {
    color:#540000;
    font-weight:900;
}

.sink-update-header {
    background-color:#ccc7b5;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    text-align: center;
    padding:5px;
}

.sink-update-content {
    padding-top:10px;
    padding-bottom: 10px;
}

.numbers {
    font-family: courier;
}

.sink-update-section {
    background-color: #f3edd6;
    border-radius: 5px;
    box-shadow: 0 0 1px 1px grey;
}

#panel-content {
    margin-left: -6px;
    margin-right: -6px;

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