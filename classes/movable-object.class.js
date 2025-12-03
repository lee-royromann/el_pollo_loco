/**
 * Base class for objects that can move and collide.
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 1.2;
    offset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    };
    energy = 100;
    lastHit = 0;

    /**
     * Applies gravity to the object, making it fall.
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 60);
    }

    /**
     * Checks if the object is above ground level.
     * @returns {boolean} True if above ground.
     */
    isAboveGround() {
        return this.y < 120;
    }

    /**
     * Moves the object to the left.
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Moves the object to the right.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Makes the object jump by setting vertical speed.
     */
    jump() {
        this.speedY = 23;
    }

    /**
     * Plays an animation by cycling through the given images.
     * @param {string[]} images - Array of image paths for the animation.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        let img = this.imageCache[path];
        if (img) {
            this.img = img;
        }
        this.currentImage++;
    }

    /**
     * Checks if this object is colliding with another object.
     * @param {MovableObject} obj - The object to check collision with.
     * @returns {boolean} True if colliding.
     */
    isColliding(obj) {
        return this.isCollidingHorizontally(obj) && this.isCollidingVertically(obj);
    }

    /**
     * Reduces energy when hit and plays hurt sound.
     */
    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
            playSound(sounds.characterHurt);
        }
    }

    /**
     * Checks if the object was recently hurt.
     * @returns {boolean} True if hurt within last 0.5 seconds.
     */
    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 0.5;
    }

    /**
     * Checks if the object is dead.
     * @returns {boolean} True if energy is zero.
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Checks horizontal collision with another object.
     * @param {MovableObject} obj - The object to check.
     * @returns {boolean} True if horizontally overlapping.
     */
    isCollidingHorizontally(obj) {
        return this.x + this.width - this.offset.right > obj.x + obj.offset.left &&
               this.x + this.offset.left < obj.x + obj.width - obj.offset.right;
    }

    /**
     * Checks vertical collision with another object.
     * @param {MovableObject} obj - The object to check.
     * @returns {boolean} True if vertically overlapping.
     */
    isCollidingVertically(obj) {
        return this.y + this.height - this.offset.bottom > obj.y + obj.offset.top &&
               this.y + this.offset.top < obj.y + obj.height - obj.offset.bottom;
    }
}
