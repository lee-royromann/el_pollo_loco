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

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 60);
    }

    isAboveGround() {
        return this.y < 120;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    moveRight() {
        this.x += this.speed;
    }

    jump() {
        this.speedY = 23;
    }

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        let img = this.imageCache[path];
        if (img) {
            this.img = img;
        }
        this.currentImage++;
    }

    isColliding(obj) {
        return this.isCollidingHorizontally(obj) && this.isCollidingVertically(obj);
    }

    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
            playSound(sounds.characterHurt);
        }
    }

    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 0.5;
    }

    isDead() {
        return this.energy == 0;
    }

    isCollidingHorizontally(obj) {
        return this.x + this.width - this.offset.right > obj.x + obj.offset.left &&
               this.x + this.offset.left < obj.x + obj.width - obj.offset.right;
    }

    isCollidingVertically(obj) {
        return this.y + this.height - this.offset.bottom > obj.y + obj.offset.top &&
               this.y + this.offset.top < obj.y + obj.height - obj.offset.bottom;
    }
}
