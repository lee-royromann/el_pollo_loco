class Bottle extends MovableObject {
    IMAGES_BOTTLE = [
        "./img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
        "./img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
    ];

    constructor(x, y) {
        super().loadImage("./img/6_salsa_bottle/1_salsa_bottle_on_ground.png");
        this.loadImages(this.IMAGES_BOTTLE);
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 80;
        this.offset = {
            top: 10,
            bottom: 10,
            left: 20,
            right: 20,
        };
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_BOTTLE);
        }, 300);
    }
}
