/**
 * A collectible bottle on the ground.
 * @extends MovableObject
 */
class Bottle extends MovableObject {
    IMAGES_BOTTLE = [
        "./img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
        "./img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
    ];

    /**
     * Creates a bottle at the given position.
     * @param {number} x - X position of the bottle.
     * @param {number} y - Y position of the bottle.
     */
    constructor(x, y) {
        super().loadImage("./img/6_salsa_bottle/1_salsa_bottle_on_ground.png");
        this.loadImages(this.IMAGES_BOTTLE);
        this.initPosition(x, y);
        this.initOffset();
        this.animate();
    }

    /**
     * Sets the bottle's position and size.
     * @param {number} x - X position.
     * @param {number} y - Y position.
     */
    initPosition(x, y) {
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 80;
    }

    /**
     * Sets the collision offset.
     * Large horizontal offsets prevent "shadow collecting" before visual contact.
     */
    initOffset() {
        this.offset = { top: 20, bottom: 15, left: 35, right: 35 };
    }

    /**
     * Starts the bottle animation.
     */
    animate() {
        setInterval(() => {
            if (this.world && this.world.isPaused) return;
            this.playAnimation(this.IMAGES_BOTTLE);
        }, 300);
    }
}
