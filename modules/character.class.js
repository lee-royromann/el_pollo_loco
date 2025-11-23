class Character extends MovableObject {
    IMAGES_WALKING = [
        "./img/2_character_pepe/2_walk/W-21.png",
        "./img/2_character_pepe/2_walk/W-22.png",
        "./img/2_character_pepe/2_walk/W-23.png",
        "./img/2_character_pepe/2_walk/W-24.png",
        "./img/2_character_pepe/2_walk/W-25.png",
        "./img/2_character_pepe/2_walk/W-26.png",
    ];

    IMAGES_JUMPING = [
        "./img/2_character_pepe/3_jump/J-31.png",
        "./img/2_character_pepe/3_jump/J-32.png",
        "./img/2_character_pepe/3_jump/J-33.png",
        "./img/2_character_pepe/3_jump/J-34.png",
        "./img/2_character_pepe/3_jump/J-35.png",
        "./img/2_character_pepe/3_jump/J-36.png",
        "./img/2_character_pepe/3_jump/J-37.png",
        "./img/2_character_pepe/3_jump/J-38.png",
        "./img/2_character_pepe/3_jump/J-39.png",
    ];

    IMAGES_DEAD = [
        "./img/2_character_pepe/5_dead/D-51.png",
        "./img/2_character_pepe/5_dead/D-52.png",
        "./img/2_character_pepe/5_dead/D-53.png",
        "./img/2_character_pepe/5_dead/D-54.png",
        "./img/2_character_pepe/5_dead/D-55.png",
        "./img/2_character_pepe/5_dead/D-56.png",
        "./img/2_character_pepe/5_dead/D-57.png",
    ];

    IMAGES_HURT = [
        "./img/2_character_pepe/4_hurt/H-41.png",
        "./img/2_character_pepe/4_hurt/H-42.png",
        "./img/2_character_pepe/4_hurt/H-43.png",
    ];

    IMAGES_IDLE = [
        "./img/2_character_pepe/1_idle/idle/I-1.png",
        "./img/2_character_pepe/1_idle/idle/I-2.png",
        "./img/2_character_pepe/1_idle/idle/I-3.png",
        "./img/2_character_pepe/1_idle/idle/I-4.png",
        "./img/2_character_pepe/1_idle/idle/I-5.png",
        "./img/2_character_pepe/1_idle/idle/I-6.png",
        "./img/2_character_pepe/1_idle/idle/I-7.png",
        "./img/2_character_pepe/1_idle/idle/I-8.png",
        "./img/2_character_pepe/1_idle/idle/I-9.png",
        "./img/2_character_pepe/1_idle/idle/I-10.png",
    ];

    IMAGES_LONG_IDLE = [
        "./img/2_character_pepe/1_idle/long_idle/I-11.png",
        "./img/2_character_pepe/1_idle/long_idle/I-12.png",
        "./img/2_character_pepe/1_idle/long_idle/I-13.png",
        "./img/2_character_pepe/1_idle/long_idle/I-14.png",
        "./img/2_character_pepe/1_idle/long_idle/I-15.png",
        "./img/2_character_pepe/1_idle/long_idle/I-16.png",
        "./img/2_character_pepe/1_idle/long_idle/I-17.png",
        "./img/2_character_pepe/1_idle/long_idle/I-18.png",
        "./img/2_character_pepe/1_idle/long_idle/I-19.png",
        "./img/2_character_pepe/1_idle/long_idle/I-20.png",
    ];

    constructor() {
        super().loadImage("./img/2_character_pepe/1_idle/idle/I-1.png");
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.applyGravity();
        this.x = 100;
        this.y = 120;
        this.height = 320;
        this.width = 160;
        this.world;
        this.speed = 8;
        this.jumpAnimationIndex = 0;
        this.lastAction = new Date().getTime();
        this.coins = 0;
        this.maxCoins = 14;
        this.bottles = 0;
        this.maxBottles = 10;
        this.deathSoundPlayed = false;
        this.deathAnimationDone = false;
        this.deathFrameIndex = 0;
        this.offset = {
            top: 120,
            bottom: 30,
            left: 40,
            right: 40,
        };
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.isAboveGround()) {
                if (this.jumpAnimationIndex < this.IMAGES_JUMPING.length) {
                    this.img =
                        this.imageCache[
                            this.IMAGES_JUMPING[this.jumpAnimationIndex]
                        ];
                    this.jumpAnimationIndex++;
                }
            } else if (this.jumpAnimationIndex > 0) {
                this.img =
                    this.imageCache[
                        this.IMAGES_JUMPING[this.IMAGES_JUMPING.length - 1]
                    ];
                this.jumpAnimationIndex = 0;
            }
        }, 80);

        setInterval(() => {
            if (
                this.world.keyboard.RIGHT &&
                this.x < this.world.level.level_end_x
            ) {
                this.moveRight();
                this.otherDirection = false;
                this.lastAction = new Date().getTime();
            } else if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
                this.lastAction = new Date().getTime();
            }
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead()) {
                if (!this.deathSoundPlayed) {
                    sounds.characterDead.play();
                    this.deathSoundPlayed = true;
                }
                if (!this.deathAnimationDone) {
                    this.playDeathOnce();
                }
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (
                (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) &&
                !this.isAboveGround() &&
                this.jumpAnimationIndex === 0
            ) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 100);

        setInterval(() => {
            if (
                !this.isDead() &&
                !this.isHurt() &&
                !this.world.keyboard.RIGHT &&
                !this.world.keyboard.LEFT &&
                !this.isAboveGround() &&
                this.jumpAnimationIndex === 0
            ) {
                let timeSinceLastAction =
                    new Date().getTime() - this.lastAction;
                if (timeSinceLastAction > 5000) {
                    this.playAnimation(this.IMAGES_LONG_IDLE);
                    if (sounds.characterSnoring.paused) {
                        sounds.characterSnoring.play();
                    }
                } else {
                    this.playAnimation(this.IMAGES_IDLE);
                    if (!sounds.characterSnoring.paused) {
                        sounds.characterSnoring.pause();
                        sounds.characterSnoring.currentTime = 0;
                    }
                }
            } else {
                if (!sounds.characterSnoring.paused) {
                    sounds.characterSnoring.pause();
                    sounds.characterSnoring.currentTime = 0;
                }
            }
        }, 150);

        setInterval(() => {
            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.jump();
                this.lastAction = new Date().getTime();
                sounds.characterJump.currentTime = 0;
                sounds.characterJump.play();
            }
        }, 100);

        setInterval(() => {
            if (
                (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) &&
                !this.isAboveGround() &&
                !this.isHurt()
            ) {
                sounds.characterWalking.currentTime = 0;
                sounds.characterWalking.play();
            }
        }, 350);
    }

    playDeathOnce() {
        // Spiele die Todes-Frames genau einmal und bleibe auf dem letzten Bild stehen
        if (this.deathFrameIndex < this.IMAGES_DEAD.length) {
            const path = this.IMAGES_DEAD[this.deathFrameIndex];
            const img = this.imageCache[path];
            if (img) {
                this.img = img;
            }
            this.deathFrameIndex++;
            if (this.deathFrameIndex >= this.IMAGES_DEAD.length) {
                // Nach kompletter Sequenz auf erstes Dead-Bild (D-51) einfrieren
                const firstPath = this.IMAGES_DEAD[0];
                const firstImg = this.imageCache[firstPath];
                if (firstImg) {
                    this.img = firstImg;
                }
                this.deathAnimationDone = true;
            }
        } else {
            // Falls bereits durchgelaufen, sicherstellen, dass D-51 angezeigt wird
            const firstPath = this.IMAGES_DEAD[0];
            const firstImg = this.imageCache[firstPath];
            if (firstImg) {
                this.img = firstImg;
            }
            this.deathAnimationDone = true;
        }
    }
}
