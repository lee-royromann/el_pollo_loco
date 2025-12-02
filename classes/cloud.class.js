/**
 * A cloud in the background.
 * @extends MovableObject
 */
class Cloud extends MovableObject {

    /**
     * Creates a cloud at the given x position.
     * @param {number} [x=Math.random()*800] - X position of the cloud.
     */
    constructor(x = Math.random() * 800) {
        super().loadImage("./img/5_background/layers/4_clouds/1.png");
        this.y = 30;
        this.x = x;
        this.height = 250;
        this.width = 400;
        this.world = null;
        this.animate();
    }

    /**
     * Starts the cloud animation, moving it left.
     */
    animate() {
        setInterval(() => {
            if (this.world && !this.world.isPaused) {
                this.moveLeft();
            }
        }, 1000 / 60);
    }
}
