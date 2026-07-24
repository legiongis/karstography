<script>
    import {slide} from 'svelte/transition';
    import CloseButton from "./buttons/CloseButton.svelte";

    let {
        poiList,
        zoomToPoi,
        visible = $bindable(),
    } = $props();
</script>

{#if visible}
<div class="example-bottom-panel" transition:slide={{duration:100}}>
    <div style="position:absolute; top:.5em; right:.5em;">
        <CloseButton bind:closeBool={visible} />
    </div>
    <div style="display:flex; flex-direction:column; padding:10px">
        <div>
            Here are some examples of different features you may encounter:
        </div>
        <div class="poi-list">
            {#each poiList as poi}
            <button onclick={() => {zoomToPoi(poi.getProperties().pk)}}>{poi.getProperties().name}</button>
            {/each}
        </div>
    </div>
</div>
{/if}

<style>
    .example-bottom-panel {
        display: flex;
        z-index: 2147483647 !important;
        bottom:0;
        background-color:#ff9f8f;
        position:absolute;
        box-shadow: 0px 0px 10px 2px #182F4C;
        width: 100%;
        height: 90px;
    }
</style>