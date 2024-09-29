<script>
    export let showAboutModal;
</script>

{#if showAboutModal}
<div class="modal-background" on:click={() => {showAboutModal=!showAboutModal}} on:keypress={() => {showAboutModal=!showAboutModal}}>
    <div class="modal-content">
        <h2>Welcome</h2>
        <p>The <em>Karst Geology Viewer</em> is a creation of the <a href="https://crawfordstewardship.org" rel="noreferrer" target="_blank">Crawford Stewardship Project</a> to map and explore the geology of southwestern Wisconsin.</p>
        <p><a href="/about" target="_blank">learn more</a></p>
        <button>Close</button>
    </div>
</div>
{/if}

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
</style>