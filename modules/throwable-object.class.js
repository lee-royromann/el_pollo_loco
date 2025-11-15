class ThrowableObject extends MovableObject {
    IMAGES_BOTTLES = [
        "./img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
        "./img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
        "./img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
        "./img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
    ];

    constructor(x, y) {
        super();
        this.loadImage(this.IMAGES_BOTTLES[0]);
        this.loadImages(this.IMAGES_BOTTLES);
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 90;
        this.throw();
        this.animate();
    }

    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 120;
        }
    }

    throw() {
        this.speedY = 20;
        this.applyGravity();
        setInterval(() => {
            this.x += 10;
        }, 1000 / 60);
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_BOTTLES);
        }, 50);
    }
}
