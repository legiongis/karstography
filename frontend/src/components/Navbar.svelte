<script>
    import LinkButton from "./buttons/LinkButton.svelte";

    export let user;
    export let environment;

    export let showSinkPanel;
    export let showExamplePanel;
    export let showAboutModal;
    export let showLayerPanel;
</script>


<div id="navbar">
    <div>
        <LinkButton bold={true} onClick={() => {showSinkPanel=!showSinkPanel}}>sink evaluation</LinkButton> |
        <LinkButton bold={true} onClick={() => {showExamplePanel=!showExamplePanel}}>examples</LinkButton>
    </div>
    <div>
        {#if environment == "staging"}<span style="color:red">¡Staging Server!</span>{/if}
        <h1 style="display:inline;">Karst Geology Viewer</h1>
        {#if environment == "staging"}<span style="color:red">¡Staging Server!</span>{/if}
        {#if user.username}&nbsp;| <span>{user.username}</span>{/if}</div>
    <div>
        <LinkButton bold={true} title="open layers panel" onClick={() => {showLayerPanel=!showLayerPanel}}>layers</LinkButton> |
        <a href="/about/data.html">data</a> |
        <a href="/about">about</a> |
        {#if user.username}
        <a href="/logout?next=/">logout</a>
        {:else}
        <a href="/login?next=/">login</a>
        {/if}
    </div>
</div>

<style>
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


    #navbar div {
        padding: 0px 10px;
        text-align: center;
    }

    #navbar a {
        color: black;
        text-decoration: none;
    }
    #navbar a:hover {
        text-decoration: underline;
    }

    #navbar div h1 {
        margin: 0;
        font-size: 1.25em;
    }
</style>