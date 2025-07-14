<script>
    import { tool, walkableAreas, zIndexAreas, characterPoints, backgroundImage, interactionAreas } from '../stores/stores.js';
    import { get } from 'svelte/store';

    function setTool(newTool) {
        tool.set(newTool);
    }

    function loadBackgroundImage() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/png';
        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = readerEvent => {
                const image = new Image();
                image.onload = () => {
                    backgroundImage.set(image);
                };
                image.src = readerEvent.target.result;
            };
            reader.readAsDataURL(file);
        };
        input.click();
    }

    function exportJson() {
        const scene = {
            walkable_areas: get(walkableAreas).map(area => ({
                points: area.points,
            })),
            z_index_areas: get(zIndexAreas).map(area => ({
                points: area.points,
                z_index: area.zIndex,
            })),
            interaction_areas: get(interactionAreas).map(area => ({
                points: area.points,
                name: area.name,
                interaction_type: area.interactionType,
            })),
            character_points: get(characterPoints),
        };

        const jsonString = JSON.stringify({ scene }, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'scene.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
</script>

<div class="toolbar">
    <button on:click={loadBackgroundImage} title="Load Background Image">
        <i class="material-icons">photo</i>
        <span>Load BG</span>
    </button>
    <button on:click={() => setTool('select')} class:active={$tool === 'select'} title="Select">
        <i class="material-icons">touch_app</i>
        <span>Select</span>
    </button>
    <button on:click={() => setTool('walkable')} class:active={$tool === 'walkable'} title="Create Walkable Area">
        <i class="material-icons">timeline</i>
        <span>Walkable</span>
    </button>
    <button on:click={() => setTool('zindex')} class:active={$tool === 'zindex'} title="Create Z-Index Area">
        <i class="material-icons">layers</i>
        <span>Z-Index</span>
    </button>
    <button on:click={() => setTool('interaction')} class:active={$tool === 'interaction'} title="Create Interaction Area">
        <i class="material-icons">interests</i>
        <span>Interaction</span>
    </button>
    <button on:click={() => setTool('character')} class:active={$tool === 'character'} title="Create Character Point">
        <i class="material-icons">person_add</i>
        <span>Character</span>
    </button>
    <button on:click={exportJson} title="Export JSON">
        <i class="material-icons">save</i>
        <span>Export</span>
    </button>
</div>

<style>
    .toolbar {
        display: flex;
        gap: 10px;
        padding: 10px;
        background-color: #f0f0f0;
        align-items: center;
    }
    button {
        display: flex;
        align-items: center;
        gap: 5px;
        background: none;
        border: 1px solid #ccc;
        cursor: pointer;
        padding: 8px 12px;
        border-radius: 5px;
        font-family: sans-serif;
    }
    button:hover {
        background-color: #e0e0e0;
    }
    button.active {
        background-color: #ccc;
        border-color: #999;
    }
</style>
