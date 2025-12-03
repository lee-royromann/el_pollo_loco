/**
 * The main player character Pepe.
 * @extends MovableObject
 */
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

    /**
     * Creates the character.
     */
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
        this.intervals = [];
        this.offset = {
            top: 120,
            bottom: 30,
            left: 40,
            right: 40,
        };
        this.animate();
    }

    /**
     * Starts all character animations and controls.
     */
    animate() {
        this.startJumpAnimation();
        this.startMovementControl();
        this.startAnimationControl();
        this.startIdleAnimation();
        this.startJumpControl();
        this.startWalkingSoundControl();
    }

    /**
     * Controls the jump animation frames.
     */
    startJumpAnimation() {
        this.intervals.push(
            setInterval(() => {
                if (this.world && this.world.isPaused) return;
                if (this.isAboveGround() && this.jumpAnimationIndex < this.IMAGES_JUMPING.length) {
                    this.setJumpFrame(this.jumpAnimationIndex);
                    this.jumpAnimationIndex++;
                } else if (!this.isAboveGround() && this.jumpAnimationIndex > 0
                ) {
                    this.setJumpFrame(this.IMAGES_JUMPING.length - 1);
                    this.jumpAnimationIndex = 0;
                }
            }, 80)
        );
    }

    /**
     * Controls character movement based on keyboard input.
     */
    startMovementControl() {
        this.intervals.push(
            setInterval(() => {
                if (!this.world || this.world.isPaused) return;
                if (this.canMoveRight()) {
                    this.moveRight();
                    this.otherDirection = false;
                    this.updateLastAction();
                } else if (this.canMoveLeft()) {
                    this.moveLeft();
                    this.otherDirection = true;
                    this.updateLastAction();
                }
                this.world.camera_x = -this.x + 100;
            }, 1000 / 60)
        );
    }

    /**
     * Controls which animation to play based on state.
     */
    startAnimationControl() {
        this.intervals.push(
            setInterval(() => {
                if (this.world && this.world.isPaused) return;
                if (this.isDead()) this.handleDeathAnimation();
                else if (this.isHurt()) this.playAnimation(this.IMAGES_HURT);
                else if (this.isWalking())
                    this.playAnimation(this.IMAGES_WALKING);
            }, 100)
        );
    }

    /**
     * Controls the idle animation based on idle duration.
     */
    startIdleAnimation() {
        this.intervals.push(
            setInterval(() => {
                if (this.world && this.world.isPaused) {
                    this.stopSnoringSound();
                    return;
                }
                if (this.shouldBeIdle()) {
                    this.isLongIdle() ? this.playLongIdle() : this.playShortIdle();
                } else {
                    this.stopSnoringSound();
                }
            }, 150)
        );
    }

    /**
     * Controls jump input and triggers jump action.
     */
    startJumpControl() {
        this.intervals.push(
            setInterval(() => {
                if (this.world && this.world.isPaused) return;
                if (this.canJump()) {
                    this.jump();
                    this.updateLastAction();
                    this.playJumpSound();
                }
            }, 100)
        );
    }

    /**
     * Controls the walking sound playback.
     */
    startWalkingSoundControl() {
        this.intervals.push(
            setInterval(() => {
                if (this.world && this.world.isPaused) return;
                if (this.shouldPlayWalkingSound()) {
                    sounds.characterWalking.currentTime = 0;
                    playSound(sounds.characterWalking);
                }
            }, 350)
        );
    }

    /**
     * Checks if the character can move right.
     * @returns {boolean} True if right movement is possible.
     */
    canMoveRight() {
        return (this.world && this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x);
    }

    /**
     * Checks if the character can move left.
     * @returns {boolean} True if left movement is possible.
     */
    canMoveLeft() {
        return this.world && this.world.keyboard.LEFT && this.x > 0;
    }

    /**
     * Checks if the character is currently walking.
     * @returns {boolean} True if character is walking.
     */
    isWalking() {
        return (this.world && (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && !this.isAboveGround() && this.jumpAnimationIndex === 0);
    }

    /**
     * Checks if the character should play idle animation.
     * @returns {boolean} True if character should be idle.
     */
    shouldBeIdle() {
        return (
            this.world &&
            !this.isDead() &&
            !this.isHurt() &&
            !this.world.keyboard.RIGHT &&
            !this.world.keyboard.LEFT &&
            !this.isAboveGround() &&
            this.jumpAnimationIndex === 0
        );
    }

    /**
     * Checks if character has been idle for a long time.
     * @returns {boolean} True if idle for more than 5 seconds.
     */
    isLongIdle() {
        return new Date().getTime() - this.lastAction > 5000;
    }

    /**
     * Checks if the character can jump.
     * @returns {boolean} True if jump is possible.
     */
    canJump() {
        return this.world && this.world.keyboard.SPACE && !this.isAboveGround();
    }

    /**
     * Checks if walking sound should be played.
     * @returns {boolean} True if walking sound should play.
     */
    shouldPlayWalkingSound() {
        return (this.world && (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) &&!this.isAboveGround() &&!this.isHurt());
    }

    /**
     * Sets the current jump animation frame.
     * @param {number} index - The frame index to display.
     */
    setJumpFrame(index) {
        this.img = this.imageCache[this.IMAGES_JUMPING[index]];
    }

    /**
     * Plays the long idle animation with snoring sound.
     */
    playLongIdle() {
        this.playAnimation(this.IMAGES_LONG_IDLE);
        this.startSnoringSound();
    }

    /**
     * Plays the short idle animation without snoring.
     */
    playShortIdle() {
        this.playAnimation(this.IMAGES_IDLE);
        this.stopSnoringSound();
    }

    /**
     * Plays the jump sound effect.
     */
    playJumpSound() {
        sounds.characterJump.currentTime = 0;
        playSound(sounds.characterJump);
    }

    /**
     * Handles the death animation and sound.
     */
    handleDeathAnimation() {
        if (!this.deathSoundPlayed) {
            playSound(sounds.characterDead);
            this.deathSoundPlayed = true;
        }
        if (!this.deathAnimationDone) this.playDeathOnce();
    }

    /**
     * Updates the timestamp of the last action.
     */
    updateLastAction() {
        this.lastAction = new Date().getTime();
    }

    /**
     * Starts the snoring sound if not already playing.
     */
    startSnoringSound() {
        if (sounds.characterSnoring.paused) playSound(sounds.characterSnoring);
    }

    /**
     * Stops the snoring sound and resets playback.
     */
    stopSnoringSound() {
        if (!sounds.characterSnoring.paused) {
            sounds.characterSnoring.pause();
            sounds.characterSnoring.currentTime = 0;
        }
    }

    /**
     * Stops all movement intervals and sounds.
     */
    stopMoving() {
        this.intervals.forEach((interval) => clearInterval(interval));
        this.intervals = [];
        this.stopSnoringSound();
    }

    /**
     * Plays the death animation once frame by frame.
     */
    playDeathOnce() {
        if (this.deathFrameIndex < this.IMAGES_DEAD.length) {
            this.setDeathFrame(this.deathFrameIndex);
            this.deathFrameIndex++;
            if (this.deathFrameIndex >= this.IMAGES_DEAD.length) {
                this.finishDeathAnimation();
            }
        } else {
            this.finishDeathAnimation();
        }
    }

    /**
     * Sets the current death animation frame.
     * @param {number} index - The frame index to display.
     */
    setDeathFrame(index) {
        const img = this.imageCache[this.IMAGES_DEAD[index]];
        if (img) this.img = img;
    }

    /**
     * Marks the death animation as complete.
     */
    finishDeathAnimation() {
        this.setDeathFrame(0);
        this.deathAnimationDone = true;
    }
}
