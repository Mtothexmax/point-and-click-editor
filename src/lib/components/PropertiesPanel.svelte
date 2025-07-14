<script>
    import { selectedObject, zIndexAreas, characterPoints, interactionAreas } from '../stores/stores.js';

    let zIndex;
    let relativeHeight = 0.1;
    let name = '';
    let interactionType = 'interaction';

    $: if ($selectedObject && $selectedObject.type === 'zindex') {
        zIndex = $selectedObject.zIndex;
    }

    $: if ($selectedObject && $selectedObject.type === 'character') {
        relativeHeight = $selectedObject.relativeHeight;
    }

    $: if ($selectedObject && $selectedObject.type === 'interaction') {
        name = $selectedObject.name;
        interactionType = $selectedObject.interactionType;
    }

    function updateZIndex() {
        if ($selectedObject && $selectedObject.type === 'zindex') {
            $selectedObject.zIndex = zIndex;
            zIndexAreas.update(areas => [...areas]);
        }
    }

    function updateRelativeHeight() {
        if ($selectedObject && $selectedObject.type === 'character') {
            $selectedObject.relativeHeight = relativeHeight;
            characterPoints.update(points => [...points]);
        }
    }

    function updateName() {
        if ($selectedObject && $selectedObject.type === 'interaction') {
            $selectedObject.name = name;
            interactionAreas.update(areas => [...areas]);
        }
    }

    function updateInteractionType() {
        if ($selectedObject && $selectedObject.type === 'interaction') {
            $selectedObject.interactionType = interactionType;
            interactionAreas.update(areas => [...areas]);
        }
    }
</script>

<div class="properties-panel">
    {#if $selectedObject}
        <h2>Properties</h2>
        <p>Type: {$selectedObject.type}</p>
        
        {#if $selectedObject.type === 'zindex'}
            <label>
                Z-Index:
                <input type="range" min="0" max="1" step="0.01" bind:value={zIndex} on:input={updateZIndex}>
                <span>{zIndex.toFixed(2)}</span>
            </label>
        {/if}

        {#if $selectedObject.type === 'interaction'}
            <label>
                Name:
                <input type="text" bind:value={name} on:input={updateName}>
            </label>
            <label>
                Interaction Type:
                <select bind:value={interactionType} on:change={updateInteractionType}>
                    <option value="interaction">Interaction</option>
                    <option value="scene_change">Scene Change</option>
                </select>
            </label>
        {/if}

        {#if $selectedObject.type === 'character'}
            <label>
                Relative Height:
                <input type="range" min="0.01" max="1" step="0.01" bind:value={relativeHeight} on:input={updateRelativeHeight}>
                <span>{relativeHeight.toFixed(2)}</span>
            </label>
        {/if}

    {:else}
        <p>No object selected</p>
    {/if}
</div>

<style>
    .properties-panel {
        padding: 20px;
        background-color: #f7f7f7;
        border-left: 1px solid #ddd;
        width: 280px;
        font-family: sans-serif;
        color: #333;
    }
    h2 {
        margin-top: 0;
        font-size: 1.2em;
        border-bottom: 1px solid #ddd;
        padding-bottom: 10px;
        margin-bottom: 20px;
    }
    p {
        margin-bottom: 20px;
    }
    label {
        display: block;
        margin-bottom: 15px;
    }
    input[type="range"] {
        width: 100%;
    }
    span {
        display: block;
        text-align: right;
        font-size: 0.9em;
        color: #666;
    }
</style>
