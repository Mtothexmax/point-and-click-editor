import { Drawable } from './Drawable.js';

export class CharacterPoint extends Drawable {
    constructor(basePoint) {
        super();
        this.basePoint = basePoint; // Relative coordinates for the base of the character
        this.relativeHeight = 0.1; // Height relative to the background image height
        this.type = 'character';
        this.characterImage = new Image();
        this.characterImage.src = '/character.svg';
        this.isDraggingHandle = false; // New property to indicate if the handle is being dragged
    }

    move(dx, dy, imageRenderInfo) {
        const rdx = dx / imageRenderInfo.width;
        const rdy = dy / imageRenderInfo.height;
        this.basePoint.x += rdx;
        this.basePoint.y += rdy;
    }

    moveHeight(dy, imageRenderInfo) {
        const rdy = dy / imageRenderInfo.height;
        this.relativeHeight -= rdy; // Negative dy means dragging up, so increase height
        this.relativeHeight = Math.max(0.01, this.relativeHeight); // Minimum height
    }

    isPointInside(p, imageRenderInfo) {
        const canvasBasePoint = {
            x: this.basePoint.x * imageRenderInfo.width + imageRenderInfo.x,
            y: this.basePoint.y * imageRenderInfo.height + imageRenderInfo.y
        };
        const distance = Math.sqrt(Math.pow(p.x - canvasBasePoint.x, 2) + Math.pow(p.y - canvasBasePoint.y, 2));
        return distance < 10; // 10px radius for selection of the base point
    }

    isPointInsideHandle(p, imageRenderInfo) {
        const canvasBasePoint = {
            x: this.basePoint.x * imageRenderInfo.width + imageRenderInfo.x,
            y: this.basePoint.y * imageRenderInfo.height + imageRenderInfo.y
        };
        const canvasHeight = this.relativeHeight * imageRenderInfo.height;
        const canvasTopPoint = {
            x: canvasBasePoint.x,
            y: canvasBasePoint.y - canvasHeight
        };
        const distance = Math.sqrt(Math.pow(p.x - canvasTopPoint.x, 2) + Math.pow(p.y - canvasTopPoint.y, 2));
        return distance < 10; // 10px radius for selection of the handle
    }

    draw(ctx, imageRenderInfo) {
        const canvasBasePoint = {
            x: this.basePoint.x * imageRenderInfo.width + imageRenderInfo.x,
            y: this.basePoint.y * imageRenderInfo.height + imageRenderInfo.y
        };

        const canvasHeight = this.relativeHeight * imageRenderInfo.height;
        const imageAspectRatio = this.characterImage.width / this.characterImage.height;
        const canvasWidth = canvasHeight * imageAspectRatio;

        const imageX = canvasBasePoint.x - canvasWidth / 2;
        const imageY = canvasBasePoint.y - canvasHeight; // SVG is drawn upwards from the base

        // Draw the character SVG
        ctx.drawImage(this.characterImage, imageX, imageY, canvasWidth, canvasHeight);

        // Draw the base point
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(canvasBasePoint.x, canvasBasePoint.y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Draw the top handle
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(canvasBasePoint.x, imageY, 5, 0, Math.PI * 2);
        ctx.fill();

        if (this.selected) {
            ctx.strokeStyle = '#FFFF00';
            ctx.lineWidth = 2;
            ctx.strokeRect(imageX, imageY, canvasWidth, canvasHeight);
        }
    }

    toJSON() {
        return {
            basePoint: this.basePoint,
            relativeHeight: this.relativeHeight
        };
    }
}
