class Chicken extends MovableObject {
    IMAGES_WALKING = [
        "./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "./img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "./img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
    ];

    IMAGES_DEAD = ["./img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

    isDead = false;

    constructor(x) {
        super().loadImage(
            "./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png"
        );
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = x !== undefined ? x : 400 + Math.random() * 3200;
        this.y = 335;
        this.height = 95;
        this.width = 80;
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (!world?.isPaused && !this.isDead) {
                this.moveLeft();
            }
        }, 1000 / 60);

        setInterval(() => {
            if (!world?.isPaused && !this.isDead) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    kill() {
        this.isDead = true;
        this.speed = 0;
        playSound(sounds.chickenDead);
        this.playAnimation(this.IMAGES_DEAD);
    }
}
