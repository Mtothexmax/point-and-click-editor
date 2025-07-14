import { Polygon } from './Polygon.js';

export class ZIndexArea extends Polygon {
    constructor(points = []) {
        super(points);
        this.zIndex = 1.0;
        this.fillColor = 'rgba(0, 0, 255, 0.5)';
        this.lineColor = '#0000FF';
        this.type = 'zindex';
    }

    draw(ctx, imageRenderInfo, isDraft = false) {
        super.draw(ctx, imageRenderInfo, isDraft);

        if (this.points.length > 0) {
            const canvasPoints = this.points.map(p => ({
                x: p.x * imageRenderInfo.width + imageRenderInfo.x,
                y: p.y * imageRenderInfo.height + imageRenderInfo.y
            }));

            let centerX = canvasPoints.reduce((sum, p) => sum + p.x, 0) / canvasPoints.length;
            let centerY = canvasPoints.reduce((sum, p) => sum + p.y, 0) / canvasPoints.length;

            ctx.fillStyle = '#FFFFFF';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.zIndex.toFixed(2), centerX, centerY);
        }
    }
}
