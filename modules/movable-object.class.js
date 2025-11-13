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
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    isColliding(movableObject) {
        return (
            this.x + this.width - this.offset.right >
                movableObject.x + movableObject.offset.left &&
            this.y + this.height - this.offset.bottom >
                movableObject.y + movableObject.offset.top &&
            this.x + this.offset.left <
                movableObject.x +
                    movableObject.width -
                    movableObject.offset.right &&
            this.y + this.offset.top <
                movableObject.y +
                    movableObject.height -
                    movableObject.offset.bottom
        );
    }

    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit; // Wie viel Zeit ist seit dem letzten Treffer vergangen?
        timePassed = timePassed / 1000;
        return timePassed < 0.5;
    }

    isDead() {
        return this.energy == 0;
    }
}
