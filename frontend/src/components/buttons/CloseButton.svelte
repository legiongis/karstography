<script>
    let {
        closeBool = $bindable()
    } = $props()
    import XCircle from 'phosphor-svelte/lib/XCircle';
</script>

<button onclick={() => {closeBool=!closeBool}}>
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