<script>
    let {
        onClick,
        bold = false,
        title = "",
        children,
    } = $props();
</script>

<button onclick={onClick} {title} style={bold ? 'font-weight:900' : ''}>
    {@render  children?.()}
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