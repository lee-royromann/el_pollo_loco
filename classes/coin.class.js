/**
 * A collectible coin.
 * @extends MovableObject
 */
class Coin extends MovableObject {
    IMAGES_COIN = ["./img/8_coin/coin_1.png", "./img/8_coin/coin_2.png"];
    rotationAngle = 0;

    /**
     * Creates a coin at the given position.
     * @param {number} x - X position of the coin.
     * @param {number} y - Y position of the coin.
     */
    constructor(x, y) {
        super().loadImage("./img/8_coin/coin_1.png");
        this.loadImages(this.IMAGES_COIN);
        this.initPosition(x, y);
        this.initOffset();
        this.animate();
    }

    /**
     * Sets the coin's position and size.
     * @param {number} x - X position.
     * @param {number} y - Y position.
     */
    initPosition(x, y) {
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
    }

    /**
     * Sets the collision offset.
     * Larger offsets prevent "shadow collecting" before visual contact.
     */
    initOffset() {
        this.offset = { top: 40, bottom: 40, left: 40, right: 40 };
    }

    /**
     * Starts the coin rotation animation.
     */
    animate() {
        setInterval(() => {
            if (this.world && this.world.isPaused) return;
            this.rotationAngle += 3;
            if (this.rotationAngle >= 360) this.rotationAngle = 0;
        }, 1000 / 60);
    }

    /**
     * Draws the coin with 3D rotation effect.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        if (!this.isImageReady()) return;
        this.drawRotatedCoin(ctx);
    }

    /**
     * Checks if the coin image is loaded and ready.
     * @returns {boolean} True if image is ready.
     */
    isImageReady() {
        return this.img && this.img.complete && this.img.naturalHeight > 0;
    }

    /**
     * Draws the coin with rotation transform.
     * @param {CanvasRenderingContext2D} ctx - Canvas context.
     */
    drawRotatedCoin(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        let scaleX = Math.cos((this.rotationAngle * Math.PI) / 180);
        ctx.scale(scaleX, 1);
        ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }
}
