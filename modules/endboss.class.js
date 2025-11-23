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

    checkForActivation() {
        setInterval(() => {
            if (!this.world || !this.world.character) return;

            let distance = this.x - this.world.character.x;
            if (distance < 500 && !this.isActive && !this.isPlayingAlert) {
                this.playAlertAnimation();
            }
        }, 100);
    }

    playAlertAnimation() {
        this.isPlayingAlert = true;
        let i = 0;
        let alertInterval = setInterval(() => {
            if (i < this.IMAGES_ALERT.length) {
                this.loadImage(this.IMAGES_ALERT[i]);
                i++;
            } else {
                clearInterval(alertInterval);
                this.isPlayingAlert = false;
                this.isActive = true;
                this.startMovement();
            }
        }, 200);
    }

    startMovement() {
        setInterval(() => {
            if (
                this.isActive &&
                !this.isDead &&
                this.world &&
                this.world.character
            ) {
                let distance = this.x - this.world.character.x;
                let absDistance = Math.abs(distance);

                if (this.isAttacking) {
                    if (distance > 20) {
                        this.x -= 4;
                        this.otherDirection = false;
                    } else if (distance < -20) {
                        this.x += 4;
                        this.otherDirection = true;
                    }
                } else if (absDistance < 250 && this.canAttack()) {
                    if (distance > 0) {
                        this.otherDirection = false;
                    } else {
                        this.otherDirection = true;
                    }
                    this.attack();
                } else if (absDistance < 250 && !this.canAttack()) {
                    if (distance > 30) {
                        this.x += 0.8;
                        this.otherDirection = false;
                    } else if (distance < -30) {
                        this.x -= 0.8;
                        this.otherDirection = true;
                    }
                } else if (absDistance >= 250) {
                    if (distance > 0) {
                        this.moveLeft();
                        this.otherDirection = false;
                    } else {
                        this.moveRight();
                        this.otherDirection = true;
                    }
                }
            }
        }, 1000 / 60);
    }

    canAttack() {
        let currentTime = new Date().getTime();
        return currentTime - this.lastAttackTime > 3000;
    }

    attack() {
        this.isAttacking = true;
        this.lastAttackTime = new Date().getTime();

        setTimeout(() => {
            this.isAttacking = false;
        }, 1400);
    }

    animate() {
        setInterval(() => {
            if (this.isDead && !this.deathAnimationPlayed) {
                this.playDeathAnimation();
            } else if (this.isDead) {
                // Do nothing after death animation is played
            } else if (this.isAttacking) {
                this.playAnimation(this.IMAGES_ATTACK);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isActive && !this.isPlayingAlert) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

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

    startFalling() {
        setInterval(() => {
            this.y += 10;
        }, 1000 / 60);
    }

    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 0.5;
    }

    hit() {
        this.energy--;
        this.lastHit = new Date().getTime();
        if (this.energy <= 0) {
            this.kill();
        }
    }

    kill() {
        this.isDead = true;
        this.speed = 0;
        this.currentImage = 0;
        playSound(sounds.endbossDead);
    }
}
