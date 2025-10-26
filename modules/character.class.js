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
        this.speed = 5; // Bewegungsgeschwindigkeit nach rechts
        this.animate();
    }

    animate() {

        setInterval(() => {
            if (this.world.keyboard.RIGHT) {
                this.otherDirection = false;
                this.x += this.speed;
            }
        }, 1000/60);

        setInterval(() => {
            if (this.world.keyboard.LEFT) {
                this.otherDirection = true;
                this.x -= this.speed;
            }
        }, 1000/60);

        setInterval(() => {
            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                let i = this.currentImage % this.IMAGES_WALKING.length;
                let path = this.IMAGES_WALKING[i];
                this.img = this.imageCache[path];
                this.currentImage++;
            }
        }, 50);
    }

    jump() {
        console.log("Character jumps");
    }
}