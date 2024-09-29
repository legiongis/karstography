<script>
    export let closeBool;
    import XCircle from 'phosphor-svelte/lib/XCircle';
</script>

<button on:click={() => {closeBool=!closeBool}}>
    <XCircle />
</button>

<style>
    button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0px;
        font-family: inherit;
        font-size: 1.5em;
    }
</style>