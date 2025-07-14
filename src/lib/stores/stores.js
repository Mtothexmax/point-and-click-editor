import { writable } from 'svelte/store';

export const selectedObject = writable(null);
export const walkableAreas = writable([]);
export const zIndexAreas = writable([]);
export const characterPoints = writable([]);
export const backgroundImage = writable(null);
export const tool = writable('select'); // select, walkable, zindex, character

// Draft polygons for in-progress drawing
export const draftWalkableArea = writable(null);
export const draftZIndexArea = writable(null);
export const interactionAreas = writable([]);
export const draftInteractionArea = writable(null);
