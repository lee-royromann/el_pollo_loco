class Character extends MovableObject {

    IMAGES_WALKING = [
        './img/2_character_pepe/2_walk/W-21.png',
        './img/2_character_pepe/2_walk/W-22.png',
        './img/2_character_pepe/2_walk/W-23.png',
        './img/2_character_pepe/2_walk/W-24.png',
        './img/2_character_pepe/2_walk/W-25.png',
        './img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        './img/2_character_pepe/3_jump/J-31.png',
        './img/2_character_pepe/3_jump/J-32.png',
        './img/2_character_pepe/3_jump/J-33.png',
        './img/2_character_pepe/3_jump/J-34.png',
        './img/2_character_pepe/3_jump/J-35.png',
        './img/2_character_pepe/3_jump/J-36.png',
        './img/2_character_pepe/3_jump/J-37.png',
        './img/2_character_pepe/3_jump/J-38.png',
        './img/2_character_pepe/3_jump/J-39.png'
    ];

    constructor() {
        super().loadImage("./img/2_character_pepe/2_walk/W-21.png");
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.applyGravity();
        this.x = 100;
        this.y = 120;
        this.height = 320;
        this.width = 160;
        this.world;
        this.speed = 5;
        this.jumpAnimationIndex = 0;
        this.animate();
    }

    animate() {

        setInterval(() => {
            if (this.isAboveGround()) {
                if (this.jumpAnimationIndex < this.IMAGES_JUMPING.length) {
                    this.img = this.imageCache[this.IMAGES_JUMPING[this.jumpAnimationIndex]];
                    this.jumpAnimationIndex++;
                }
            } else if (this.jumpAnimationIndex > 0) {
                this.img = this.imageCache[this.IMAGES_JUMPING[this.IMAGES_JUMPING.length - 1]];
                this.jumpAnimationIndex = 0;
            }
        }, 80);

        setInterval(() => {           
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
            } else if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
            }
            this.world.camera_x = -this.x + 100;
        }, 1000/60);

        setInterval(() => {
            if ((this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && !this.isAboveGround() && this.jumpAnimationIndex === 0) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 50);

        setInterval(() => {
            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.jump();                
            }
        }, 100);
    }
}