import { Polygon } from './Polygon.js';

export class InteractionArea extends Polygon {
    constructor(points = []) {
        super(points);
        this.type = 'interaction';
        this.name = 'default_name';
        this.interactionType = 'interaction'; // interaction, scene_change
        this.fillColor = 'rgba(255, 165, 0, 0.5)';
        this.lineColor = '#FFA500';
    }

    draw(ctx, imageRenderInfo, isDraft = false) {
        super.draw(ctx, imageRenderInfo, isDraft);

        if (this.points.length > 2) {
            const center = this.getCenter();
            if (center) {
                const canvasCenter = {
                    x: center.x * imageRenderInfo.width + imageRenderInfo.x,
                    y: center.y * imageRenderInfo.height + imageRenderInfo.y
                };
                ctx.fillStyle = '#000000';
                ctx.font = '16px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.name, canvasCenter.x, canvasCenter.y);
            }
        }
    }
}
