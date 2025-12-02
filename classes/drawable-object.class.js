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
        try {
            if (this.img && this.img.complete && this.img.naturalHeight > 0) {
                ctx.drawImage(
                    this.img,
                    this.x,
                    this.y,
                    this.width,
                    this.height
                );
            }
        } catch (e) {
            // Picture not loaded yet, do nothing.
        }
    }

    /**
     * Draws a debug frame around the object (for collision debugging).
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    drawFrame(ctx) {
        if (
            this instanceof Character ||
            this instanceof Chicken ||
            this instanceof SmallChicken ||
            this instanceof Endboss
        ) {
            ctx.beginPath();
            ctx.lineWidth = "3";
            ctx.strokeStyle = "blue";
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.lineWidth = "3";
            ctx.strokeStyle = "red";
            ctx.rect(
                this.x + this.offset.left,
                this.y + this.offset.top,
                this.width - this.offset.left - this.offset.right,
                this.height - this.offset.top - this.offset.bottom
            );
            ctx.stroke();
        }
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
