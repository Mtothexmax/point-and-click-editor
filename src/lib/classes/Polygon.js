import { Drawable } from './Drawable.js';

export class Polygon extends Drawable {
    constructor(points = []) {
        super();
        this.points = points; // Now relative coordinates
        this.fillColor = 'rgba(0, 255, 0, 0.5)';
        this.lineColor = '#00FF00';
        this.type = 'polygon';
    }

    addPoint(point) {
        this.points.push(point);
    }

    move(dx, dy, imageRenderInfo) {
        const rdx = dx / imageRenderInfo.width;
        const rdy = dy / imageRenderInfo.height;
        this.points = this.points.map(p => ({ x: p.x + rdx, y: p.y + rdy }));
    }

    isPointInside(point, imageRenderInfo) {
        let inside = false;
        for (let i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
            const xi = this.points[i].x * imageRenderInfo.width + imageRenderInfo.x;
            const yi = this.points[i].y * imageRenderInfo.height + imageRenderInfo.y;
            const xj = this.points[j].x * imageRenderInfo.width + imageRenderInfo.x;
            const yj = this.points[j].y * imageRenderInfo.height + imageRenderInfo.y;

            const intersect = ((yi > point.y) !== (yj > point.y))
                && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }

    getCenter() {
        if (this.points.length === 0) return null;
        const total = this.points.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
        return {
            x: total.x / this.points.length,
            y: total.y / this.points.length
        };
    }

    draw(ctx, imageRenderInfo, isDraft = false) {
        if (this.points.length === 0) return;

        const canvasPoints = this.points.map(p => ({
            x: p.x * imageRenderInfo.width + imageRenderInfo.x,
            y: p.y * imageRenderInfo.height + imageRenderInfo.y
        }));

        ctx.beginPath();
        ctx.moveTo(canvasPoints[0].x, canvasPoints[0].y);
        for (let i = 1; i < canvasPoints.length; i++) {
            ctx.lineTo(canvasPoints[i].x, canvasPoints[i].y);
        }

        if (this.points.length > 2) {
            ctx.closePath();
        }

        if (this.points.length > 2) {
            ctx.fillStyle = this.fillColor;
            ctx.fill();
        }
        
        ctx.strokeStyle = this.lineColor;
        ctx.lineWidth = 1;
        ctx.stroke();

        if (this.selected) {
            ctx.strokeStyle = '#FFFF00';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        if (this.selected || isDraft) {
            canvasPoints.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
                ctx.fillStyle = '#FFFF00';
                ctx.fill();
            });
        }
    }
}
