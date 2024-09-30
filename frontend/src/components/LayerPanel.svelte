<script>
    import { slide } from 'svelte/transition';

    import Info from 'phosphor-svelte/lib/Info';

    import CloseButton from './buttons/CloseButton.svelte';
    import LinkButton from './buttons/LinkButton.svelte';

    export let visible;
    export let showLabelLayer;
    export let currentBasemap;
    export let overlayVisible;

    export let baseLayers = [];
    export let overlayGroups = [];

    function toggleInfo(layerid) {
        const disp = document.getElementById(layerid+"-info").style.display
        document.getElementById(layerid+"-info").style.display = disp == "flex" ? "none" : "flex";
    }
</script>

{#if visible}
<div id="layer-panel" transition:slide={{ duration: 100, axis: 'x' }}>
    <div style="position:absolute; top:.5em; right:.5em;">
        <CloseButton bind:closeBool={visible} />
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
                {#if layer.info}
                <LinkButton onClick={() => {toggleInfo(layer.id)}}>
                    <Info />
                </LinkButton>
                {/if}
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
            <div style="display:flex; align-items:center;">
                <label><input type=checkbox bind:checked={overlayVisible[layer.id]}>{layer.name}</label>
                {#if layer.info}
                <LinkButton onClick={() => {toggleInfo(layer.id)}}>
                    <Info />
                </LinkButton>
                {/if}
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
        <p><em>
            see the <a href="/about/data">data page</a> for downloads<br/>
            not all layers have the same coverage extent
        </em></p>
    </div>
</div>
{/if}

<style>
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
        padding: .25em;
    }

    .layer-item {
        display: flex;
        flex-direction: column;
        font-size: 1.2em;
        display: inline;
        margin-bottom: 2px;
    }

    .layer-info {
        display: none;
        padding-left: 10px;
    }

    .layer-group-header {
        margin-bottom: 4px;
        margin-top: 8px;
    }

</style>