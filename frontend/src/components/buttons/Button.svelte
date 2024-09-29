<script>
    export let onClick;
    export let title;
</script>

<button {title} on:click={onClick}>
    <slot />
</button>

<style>
    button {
        background: lightgrey;
        border-radius: 5px;
        cursor: pointer;
    }
</style>