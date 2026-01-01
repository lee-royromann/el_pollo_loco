/**
 * A bottle that can be thrown at enemies.
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
    IMAGES_BOTTLES = [
        "./img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
        "./img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
        "./img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
        "./img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
    ];

    IMAGES_SPLASH = [
        "./img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
        "./img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
        "./img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
        "./img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
        "./img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
        "./img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
    ];

    isSplashing = false;

    /**
     * Creates a throwable bottle.
     * @param {number} x - Starting x position.
     * @param {number} y - Starting y position.
     * @param {number} direction - Throw direction (1 or -1).
     */
    constructor(x, y, direction) {
        super();
        this.loadImage(this.IMAGES_BOTTLES[0]);
        this.loadImages(this.IMAGES_BOTTLES);
        this.loadImages(this.IMAGES_SPLASH);
        this.initPosition(x, y, direction);
        this.initOffset();
        this.throw();
        this.animate();
    }

    /**
     * Sets the bottle's position and direction.
     * @param {number} x - X position.
     * @param {number} y - Y position.
     * @param {number} direction - Throw direction.
     */
    initPosition(x, y, direction) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 90;
        this.direction = direction;
        this.world = null;
    }

    /**
     * Sets the collision offset.
     */
    initOffset() {
        this.offset = { top: 10, bottom: 10, left: 10, right: 10 };
    }

    /**
     * Checks if the bottle is above ground.
     * @returns {boolean} Always true for throwable objects.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 120;
        }
    }

    /**
     * Applies gravity to the thrown bottle.
     */
    applyGravity() {
        setInterval(() => {
            if (this.world && this.world.isPaused) return;
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 60);
    }

    /**
     * Throws the bottle with upward speed.
     */
    throw() {
        this.speedY = 20;
        this.applyGravity();
        this.throwInterval = setInterval(() => {
            if (this.world && !this.world.isPaused) {
                if (!this.isSplashing) {
                    this.x += 10 * this.direction;
                }
            }
        }, 1000 / 60);
    }

    /**
     * Rotates the bottle while flying.
     */
    animate() {
        setInterval(() => {
            if (this.world && !this.world.isPaused) {
                if (!this.isSplashing) {
                    this.playAnimation(this.IMAGES_BOTTLES);
                }
            }
        }, 50);
    }

    /**
     * Plays the splash animation when bottle hits something.
     */
    splash() {
        this.isSplashing = true;
        this.speedY = 0;
        this.acceleration = 0;
        clearInterval(this.throwInterval);
        let i = 0;
        let splashInterval = setInterval(() => {
            if (i < this.IMAGES_SPLASH.length) {
                this.loadImage(this.IMAGES_SPLASH[i]);
                i++;
            } else {
                clearInterval(splashInterval);
            }
        }, 100);
    }
}
