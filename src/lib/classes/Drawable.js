export class Drawable {
    constructor() {
        this.id = Date.now() + Math.random();
        this.selected = false;
        this.type = 'drawable';
    }

    move(dx, dy) {
        // To be implemented by subclasses
    }

    draw(ctx) {
        // To be implemented by subclasses
    }

    isPointInside(point) {
        // To be implemented by subclasses
        return false;
    }
}
