/**
 * A background layer image.
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {

    /**
     * Creates a background object.
     * @param {string} imagePath - Path to the background image.
     * @param {number} x - X position of the background.
     */
    constructor(imagePath, x) {
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.y = 0;
        this.height = 480;
        this.width = 720;
    }
}