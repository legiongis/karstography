<script>
    import {slide} from 'svelte/transition';

    import LinkButton from './buttons/LinkButton.svelte';
    import CloseButton from './buttons/CloseButton.svelte';

    export let visible;
    export let currentSink;
    
    let showInstructions = false;
    let disableInput = true;
</script>

{#if visible}
<div id="info-panel" class="input-form-panel" style="display:flex; flex-direction:column;" transition:slide={{duration:100, axis:'x'}}>
    <div style="position:absolute; top:.5em; right:.5em;">
        <CloseButton bind:closeBool={visible} />
    </div>
    <div>
        <p><strong>hello neighbor! let's evaluate algorithmically-derived sinks...</strong></p>
    </div>
    <div>
        <LinkButton onClick={() => {showInstructions=!showInstructions}}>{showInstructions ? 'hide' : 'show'} instructions</LinkButton>
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
    <div>
        <p style="color:red;"><em>This operation is currently disabled.</em></p>
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

<style>
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
</style>