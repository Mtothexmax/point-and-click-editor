<script>
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    import { tool, selectedObject, walkableAreas, zIndexAreas, characterPoints, backgroundImage, draftWalkableArea, draftZIndexArea, interactionAreas, draftInteractionArea } from '../stores/stores.js';
    import { WalkableArea } from '../classes/WalkableArea.js';
    import { ZIndexArea } from '../classes/ZIndexArea.js';
    import { InteractionArea } from '../classes/InteractionArea.js';
    import { CharacterPoint } from '../classes/CharacterPoint.js';

    let canvas;
    let ctx;
    let container;
    let dragging = false;
    let dragStart = { x: 0, y: 0 };
    
    let imageRenderInfo = { x: 0, y: 0, width: 0, height: 0 };

    $: $tool, finalizePolygon();

    onMount(() => {
        ctx = canvas.getContext('2d');
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const defaultBg = new Image();
        defaultBg.src = '/example_background.png';
        defaultBg.onload = () => {
            backgroundImage.set(defaultBg);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    });

    function resizeCanvas() {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        draw();
    }

    function calculateImageRenderInfo() {
        if (!$backgroundImage) return;
        const img = $backgroundImage;
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        let drawWidth, drawHeight, drawX, drawY;

        if (canvasRatio > imgRatio) {
            drawHeight = canvas.height * 0.9;
            drawWidth = drawHeight * imgRatio;
        } else {
            drawWidth = canvas.width * 0.9;
            drawHeight = drawWidth / imgRatio;
        }

        drawX = (canvas.width - drawWidth) / 2;
        drawY = (canvas.height - drawHeight) / 2;

        imageRenderInfo = { x: drawX, y: drawY, width: drawWidth, height: drawHeight };
    }

    function draw() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        calculateImageRenderInfo();

        if ($backgroundImage) {
            ctx.drawImage($backgroundImage, imageRenderInfo.x, imageRenderInfo.y, imageRenderInfo.width, imageRenderInfo.height);
        }

        $walkableAreas.forEach(area => area.draw(ctx, imageRenderInfo));
        $zIndexAreas.forEach(area => area.draw(ctx, imageRenderInfo));
        $interactionAreas.forEach(area => area.draw(ctx, imageRenderInfo));
        $characterPoints.forEach(point => point.draw(ctx, imageRenderInfo));
        
        // Draw drafts if they exist
        if ($draftWalkableArea) $draftWalkableArea.draw(ctx, imageRenderInfo, true);
        if ($draftZIndexArea) $draftZIndexArea.draw(ctx, imageRenderInfo, true);
        if ($draftInteractionArea) $draftInteractionArea.draw(ctx, imageRenderInfo, true);

        requestAnimationFrame(draw);
    }

    function getMousePos(evt) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    function toRelativeCoords(point) {
        return {
            x: (point.x - imageRenderInfo.x) / imageRenderInfo.width,
            y: (point.y - imageRenderInfo.y) / imageRenderInfo.height
        };
    }

    function finalizePolygon() {
        if ($draftWalkableArea) {
            walkableAreas.update(areas => [...areas, $draftWalkableArea]);
            draftWalkableArea.set(null);
        }
        if ($draftZIndexArea) {
            zIndexAreas.update(areas => [...areas, $draftZIndexArea]);
            draftZIndexArea.set(null);
        }
        if ($draftInteractionArea) {
            interactionAreas.update(areas => [...areas, $draftInteractionArea]);
            draftInteractionArea.set(null);
        }
    }

    function handleMouseDown(event) {
        const pos = getMousePos(event);
        dragStart = pos;

        if (event.button === 2) { // Right-click is handled by handleContextMenu
            return;
        }

        if ($tool === 'select') {
            let found = false;
            let foundHandle = false;

            // Check for character handle first
            $characterPoints.forEach(obj => {
                if (obj.isPointInsideHandle(pos, imageRenderInfo)) {
                    selectedObject.set(obj);
                    obj.selected = true;
                    obj.isDraggingHandle = true;
                    found = true;
                    foundHandle = true;
                } else {
                    obj.selected = false;
                    obj.isDraggingHandle = false;
                }
            });

            if (!foundHandle) {
                // Then check for object selection
                [...$walkableAreas, ...$zIndexAreas, ...$interactionAreas, ...$characterPoints].forEach(obj => {
                    if (obj.isPointInside(pos, imageRenderInfo)) {
                        selectedObject.set(obj);
                        obj.selected = true;
                        found = true;
                    } else {
                        obj.selected = false;
                    }
                });
            }
            
            if (!found) selectedObject.set(null);
            dragging = $selectedObject !== null;
            return;
        }

        if ($tool === 'character') {
            draftWalkableArea.set(null);
            draftZIndexArea.set(null);
            draftInteractionArea.set(null);
            const relativePos = toRelativeCoords(pos);
            const newPoint = new CharacterPoint(relativePos);
            characterPoints.update(points => [...points, newPoint]);
            selectedObject.set(newPoint);
            return;
        }

        if ($tool === 'walkable') {
            if ($draftZIndexArea) draftZIndexArea.set(null);
            if ($draftInteractionArea) draftInteractionArea.set(null);
            const relativePos = toRelativeCoords(pos);
            if (!$draftWalkableArea) {
                draftWalkableArea.set(new WalkableArea([relativePos]));
            } else {
                $draftWalkableArea.addPoint(relativePos);
            }
        } else if ($tool === 'zindex') {
            if ($draftWalkableArea) draftWalkableArea.set(null);
            if ($draftInteractionArea) draftInteractionArea.set(null);
            const relativePos = toRelativeCoords(pos);
            if (!$draftZIndexArea) {
                draftZIndexArea.set(new ZIndexArea([relativePos]));
            } else {
                $draftZIndexArea.addPoint(relativePos);
            }
        } else if ($tool === 'interaction') {
            if ($draftWalkableArea) draftWalkableArea.set(null);
            if ($draftZIndexArea) draftZIndexArea.set(null);
            const relativePos = toRelativeCoords(pos);
            if (!$draftInteractionArea) {
                draftInteractionArea.set(new InteractionArea([relativePos]));
            } else {
                $draftInteractionArea.addPoint(relativePos);
            }
        }
    }

    function handleContextMenu(event) {
        event.preventDefault(); // Prevent default context menu
        finalizePolygon();
    }

    function handleMouseMove(event) {
        if (!dragging || !$selectedObject) return;
        const pos = getMousePos(event);
        const dx = pos.x - dragStart.x;
        const dy = pos.y - dragStart.y;
        $selectedObject.move(dx, dy, imageRenderInfo);
        dragStart = pos;
    }

    function handleMouseUp(event) {
        dragging = false;
        if ($selectedObject && $selectedObject.type === 'character') {
            $selectedObject.isDraggingHandle = false;
        }
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            finalizePolygon();
        } else if (event.key === 'Escape') {
            if ($tool === 'walkable') {
                draftWalkableArea.set(null);
            } else if ($tool === 'zindex') {
                draftZIndexArea.set(null);
            } else if ($tool === 'interaction') {
                draftInteractionArea.set(null);
            }
        } else if (event.key === 'Delete' && $selectedObject) {
            walkableAreas.update(areas => areas.filter(a => a.id !== $selectedObject.id));
            zIndexAreas.update(areas => areas.filter(a => a.id !== $selectedObject.id));
            interactionAreas.update(areas => areas.filter(a => a.id !== $selectedObject.id));
            characterPoints.update(points => points.filter(p => p.id !== $selectedObject.id));
            selectedObject.set(null);
        }
    }

</script>
<div class="canvas-container" bind:this={container} on:mousedown={handleMouseDown} on:mousemove={handleMouseMove} on:mouseup={handleMouseUp} tabindex="0" on:keydown={handleKeyDown}>
    <canvas bind:this={canvas}></canvas>
</div>

<style>
    .canvas-container {
        width: 100%;
        height: 100%;
        outline: none;
    }
    canvas {
        width: 100%;
        height: 100%;
    }
</style>
