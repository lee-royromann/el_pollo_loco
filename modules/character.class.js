class Character extends MovableObject {

    IMAGES_WALKING = [
        './img/2_character_pepe/2_walk/W-21.png',
        './img/2_character_pepe/2_walk/W-22.png',
        './img/2_character_pepe/2_walk/W-23.png',
        './img/2_character_pepe/2_walk/W-24.png',
        './img/2_character_pepe/2_walk/W-25.png',
        './img/2_character_pepe/2_walk/W-26.png'
    ];

    constructor() {
        super().loadImage("./img/2_character_pepe/2_walk/W-21.png");
        this.loadImages(this.IMAGES_WALKING);
        this.x = 100;
        this.y = 120;
        this.height = 320;
        this.width = 160;
        this.world;
        this.animate();
    }

    animate() {
        let frameCount = 0; // Counter for frames
        const frameRate = 5; // Number of frames required for each image change
        const animateFrame = () => {
            frameCount++;
            if (this.world.keyboard.RIGHT && frameCount % frameRate === 0) {
                this.currentImage++;
                if (this.currentImage >= this.IMAGES_WALKING.length) {
                    this.currentImage = 0;
                }
                let path = this.IMAGES_WALKING[this.currentImage];
                this.img = this.imageCache[path];
            }
            if (frameCount >= 1000) {
                frameCount = 0;
            }
            requestAnimationFrame(animateFrame); // Calls animateFrame again
        };
        requestAnimationFrame(animateFrame); // Starts the animation loop
    }

    jump() {
        console.log("Character jumps");
    }
}