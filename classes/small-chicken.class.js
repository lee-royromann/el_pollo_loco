/**
 * A small chicken enemy.
 * @extends MovableObject
 */
class SmallChicken extends MovableObject {
    IMAGES_WALKING = [
        "./img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "./img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "./img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
    ];

    IMAGES_DEAD = ["./img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

    isDead = false;

    /**
     * Creates a small chicken at the given x position.
     * @param {number} [x] - X position, random if not provided.
     */
    constructor(x) {
        super().loadImage(
            "./img/3_enemies_chicken/chicken_small/1_walk/1_w.png"
        );
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = x !== undefined ? x : 400 + Math.random() * 3200;
        this.y = 380;
        this.height = 45;
        this.width = 55;
        this.speed = 0.1 + Math.random() * 0.3;
        this.offset = {
            top: 5,
            bottom: 5,
            left: 5,
            right: 10,
        };
        this.animate();
    }

    /**
     * Starts the chicken movement and walking animation.
     */
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

    /**
     * Kills the chicken and plays the death sound.
     */
    kill() {
        this.isDead = true;
        this.speed = 0;
        playSound(sounds.smallChickenDead);
        this.playAnimation(this.IMAGES_DEAD);
    }
}
