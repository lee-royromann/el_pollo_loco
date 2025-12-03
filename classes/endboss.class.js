/**
 * The final boss enemy.
 * @extends MovableObject
 */
class Endboss extends MovableObject {
    IMAGES_WALKING = [
        "./img/4_enemie_boss_chicken/1_walk/G1.png",
        "./img/4_enemie_boss_chicken/1_walk/G2.png",
        "./img/4_enemie_boss_chicken/1_walk/G3.png",
        "./img/4_enemie_boss_chicken/1_walk/G4.png",
    ];

    IMAGES_ALERT = [
        "./img/4_enemie_boss_chicken/2_alert/G5.png",
        "./img/4_enemie_boss_chicken/2_alert/G6.png",
        "./img/4_enemie_boss_chicken/2_alert/G7.png",
        "./img/4_enemie_boss_chicken/2_alert/G8.png",
        "./img/4_enemie_boss_chicken/2_alert/G9.png",
        "./img/4_enemie_boss_chicken/2_alert/G10.png",
        "./img/4_enemie_boss_chicken/2_alert/G11.png",
        "./img/4_enemie_boss_chicken/2_alert/G12.png",
    ];

    IMAGES_ATTACK = [
        "./img/4_enemie_boss_chicken/3_attack/G13.png",
        "./img/4_enemie_boss_chicken/3_attack/G14.png",
        "./img/4_enemie_boss_chicken/3_attack/G15.png",
        "./img/4_enemie_boss_chicken/3_attack/G16.png",
        "./img/4_enemie_boss_chicken/3_attack/G17.png",
        "./img/4_enemie_boss_chicken/3_attack/G18.png",
        "./img/4_enemie_boss_chicken/3_attack/G19.png",
        "./img/4_enemie_boss_chicken/3_attack/G20.png",
    ];

    IMAGES_HURT = [
        "./img/4_enemie_boss_chicken/4_hurt/G21.png",
        "./img/4_enemie_boss_chicken/4_hurt/G22.png",
        "./img/4_enemie_boss_chicken/4_hurt/G23.png",
    ];

    IMAGES_DEAD = [
        "./img/4_enemie_boss_chicken/5_dead/G24.png",
        "./img/4_enemie_boss_chicken/5_dead/G25.png",
        "./img/4_enemie_boss_chicken/5_dead/G26.png",
    ];

    isDead = false;
    energy = 5;
    lastHit = 0;
    deathAnimationPlayed = false;
    isActive = false;
    isPlayingAlert = false;
    isAttacking = false;
    lastAttackTime = 0;
    world = null;

    /**
     * Creates the endboss.
     */
    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 5000;
        this.y = 60;
        this.height = 400;
        this.width = 280;
        this.speed = 2;
        this.offset = {
            top: 50,
            bottom: 20,
            left: 30,
            right: 30,
        };
        this.animate();
        this.checkForActivation();
    }

    /**
     * Checks if player is close enough to activate the boss.
     */
    checkForActivation() {
        setInterval(() => {
            if (!this.world || !this.world.character || this.world.isPaused) return;
            let distance = this.x - this.world.character.x;
            if (this.isCloseEnoughToActivate(distance)) {
                this.playAlertAnimation();
            }
        }, 100);
    }

    /**
     * Plays the alert animation before boss fight starts.
     */
    playAlertAnimation() {
        this.isPlayingAlert = true;
        let i = 0;
        let alertInterval = setInterval(() => {
            if (!this.world?.isPaused) {
                if (i < this.IMAGES_ALERT.length) {
                    this.loadImage(this.IMAGES_ALERT[i]);
                    i++;
                } else {
                    clearInterval(alertInterval);
                    this.startBossFight();
                }
            }
        }, 200);
    }

    /**
     * Starts the boss movement behavior.
     */
    startMovement() {
        setInterval(() => {
            if (this.world?.isPaused) return;
            if (this.isActive && !this.isDead && this.world && this.world.character) {
                let distance = this.x - this.world.character.x;
                let absDistance = Math.abs(distance);
                
                if (this.isAttacking) {
                    this.moveTowardsPlayer(distance);
                } else if (absDistance < 250 && this.canAttack()) {
                    this.turnToPlayerAndAttack(distance);
                } else if (absDistance < 250 && !this.canAttack()) {
                    this.backAwayFromPlayer(distance);
                } else if (absDistance >= 250) {
                    this.moveTowardsPlayer(distance);
                }
            }
        }, 1000 / 60);
    }

    /**
     * Checks if enough time has passed to attack again.
     * @returns {boolean} True if attack is ready.
     */
    canAttack() {
        let currentTime = new Date().getTime();
        return currentTime - this.lastAttackTime > 3000;
    }

    /**
     * Initiates an attack sequence.
     */
    attack() {
        this.isAttacking = true;
        this.lastAttackTime = new Date().getTime();

        setTimeout(() => {
            this.isAttacking = false;
        }, 1400);
    }

    /**
     * Controls the boss animation state.
     */
    animate() {
        setInterval(() => {
            if (this.world?.isPaused) return;
            if (this.isDead && !this.deathAnimationPlayed) {
                this.playDeathAnimation();
            } else if (!this.isDead) {
                if (this.isAttacking) {
                    this.playAnimation(this.IMAGES_ATTACK);
                } else if (this.isHurt()) {
                    this.playAnimation(this.IMAGES_HURT);
                } else if (this.isActive && !this.isPlayingAlert) {
                    this.playAnimation(this.IMAGES_WALKING);
                }
            }
        }, 200);
    }

    /**
     * Plays the death animation frame by frame.
     */
    playDeathAnimation() {
        if (this.currentImage < this.IMAGES_DEAD.length) {
            let path = this.IMAGES_DEAD[this.currentImage];
            this.img = this.imageCache[path];
            this.currentImage++;
        } else {
            this.deathAnimationPlayed = true;
            this.startFalling();
        }
    }

    /**
     * Makes the boss fall after death.
     */
    startFalling() {
        setInterval(() => {
            if (!this.world?.isPaused) {
                this.y += 10;
            }
        }, 1000 / 60);
    }

    /**
     * Checks if the boss was recently hurt.
     * @returns {boolean} True if hurt within last 0.5 seconds.
     */
    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 0.5;
    }

    /**
     * Reduces boss energy when hit.
     */
    hit() {
        this.energy--;
        this.lastHit = new Date().getTime();
        playSound(sounds.endbossHurt);
        if (this.energy <= 0) {
            this.kill();
        }
    }

    /**
     * Kills the boss.
     */
    kill() {
        this.isDead = true;
        this.speed = 0;
        this.currentImage = 0;
        playSound(sounds.endbossDead);
    }

    /**
     * Checks if player is close enough to wake up the boss.
     * @param {number} distance - Distance to player.
     * @returns {boolean} True if should activate.
     */
    isCloseEnoughToActivate(distance) {
        return distance < 500 && !this.isActive && !this.isPlayingAlert;
    }

    /**
     * Starts the boss fight after alert animation.
     */
    startBossFight() {
        this.isPlayingAlert = false;
        this.isActive = true;
        this.startMovement();
    }

    /**
     * Moves the boss towards the player.
     * @param {number} distance - Distance to player (positive = player is left).
     */
    moveTowardsPlayer(distance) {
        if (distance > 20) {
            this.x -= 4;
            this.otherDirection = false;
        } else if (distance < -20) {
            this.x += 4;
            this.otherDirection = true;
        }
    }

    /**
     * Turns to player and attacks.
     * @param {number} distance - Distance to player.
     */
    turnToPlayerAndAttack(distance) {
        this.otherDirection = distance <= 0;
        this.attack();
    }

    /**
     * Moves boss away from player when attack is on cooldown.
     * @param {number} distance - Distance to player.
     */
    backAwayFromPlayer(distance) {
        if (distance > 30) {
            this.x += 0.8;
            this.otherDirection = false;
        } else if (distance < -30) {
            this.x -= 0.8;
            this.otherDirection = true;
        }
    }
}
