<script>
    import Toolbar from '../lib/components/Toolbar.svelte';
    import PropertiesPanel from '../lib/components/PropertiesPanel.svelte';
    import CanvasView from '../lib/components/CanvasView.svelte';
</script>

<main>
    <Toolbar />
    <div class="content">
        <CanvasView />
        <PropertiesPanel />
    </div>
</main>

<style>
    :global(html, body) {
        margin: 0;
        padding: 0;
        height: 100%;
        overflow: hidden;
    }
    main {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }
    .content {
        display: flex;
        flex-grow: 1;
    }
    :global(.content > :first-child) {
        flex-grow: 1;
    }
</style>