<script>
    export let onClick;
    export let bold = false;
</script>

<button on:click={onClick} style={bold ? 'font-weight:900' : ''}>
    <slot/>
</button>
<style>
    button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0px;
        font-family: inherit;
        font-size: 1em;
    }

    button:hover {
        text-decoration: underline;
    }
</style>