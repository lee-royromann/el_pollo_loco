/**
 * Base class for objects that can be drawn on canvas.
 */
class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 150;
    height = 150;
    width = 100;

    /**
     * Loads a single image from the given path.
     * @param {string} path - Path to the image file.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws the object on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        if (this.img && this.img.complete && this.img.naturalHeight > 0) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }

    /**
     * Draws a debug frame around the object (for collision debugging).
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    drawFrame(ctx) {
        if (this.isDebuggableObject()) {
            this.drawBoundingBox(ctx);
            this.drawHitbox(ctx);
        }
    }

    /**
     * Checks if this object should show debug frames.
     * @returns {boolean} True if object is a debuggable type.
     */
    isDebuggableObject() {
        return this instanceof Character || this instanceof Chicken ||
               this instanceof SmallChicken || this instanceof Endboss;
    }

    /**
     * Draws the outer bounding box.
     * @param {CanvasRenderingContext2D} ctx - Canvas context.
     */
    drawBoundingBox(ctx) {
        ctx.beginPath();
        ctx.lineWidth = "3";
        ctx.strokeStyle = "blue";
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }

    /**
     * Draws the inner hitbox with offset.
     * @param {CanvasRenderingContext2D} ctx - Canvas context.
     */
    drawHitbox(ctx) {
        ctx.beginPath();
        ctx.lineWidth = "3";
        ctx.strokeStyle = "red";
        let x = this.x + this.offset.left;
        let y = this.y + this.offset.top;
        let w = this.width - this.offset.left - this.offset.right;
        let h = this.height - this.offset.top - this.offset.bottom;
        ctx.rect(x, y, w, h);
        ctx.stroke();
    }

    /**
     * Loads multiple images and stores them in the image cache.
     * @param {string[]} arr - Array of image paths to load.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}
