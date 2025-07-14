import { Polygon } from './Polygon.js';

export class WalkableArea extends Polygon {
    constructor(points = []) {
        super(points);
        this.type = 'walkable';
    }
}
