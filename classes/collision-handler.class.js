/**
 * Checks and handles all collisions.
 */
class CollisionHandler {
    /**
     * Creates a collision handler.
     * @param {World} world - Reference to the game world.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Checks all collision types each frame.
     */
    checkAllCollisions() {
        this.checkEnemyCollisions();
        this.checkBottleCollisions();
        this.checkCoinCollisions();
        this.checkBottleCollections();
    }

    /**
     * Checks collisions between character and enemies.
     */
    checkEnemyCollisions() {
        this.world.level.enemies.forEach((enemy) => {
            if (this.world.character.isColliding(enemy) && !enemy.isDead) {
                if (this.isJumpingOnEnemy(enemy) && !this.isEndboss(enemy)) {
                    this.killEnemy(enemy);
                } else if (!this.world.character.isHurt()) {
                    this.damageCharacter();
                }
            }
        });
    }

    /**
     * Checks collisions between thrown bottles and enemies.
     */
    checkBottleCollisions() {
        this.world.throwableObjects.forEach((bottle, bottleIndex) => {
            this.world.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy) && !enemy.isDead && !bottle.isSplashing) {
                    this.handleBottleHit(bottle, enemy, bottleIndex);
                }
            });
        });
    }

    /**
     * Checks collisions between character and coins.
     */
    checkCoinCollisions() {
        this.world.level.coins.forEach((coin, coinIndex) => {
            if (this.world.character.isColliding(coin)) {
                this.collectCoin(coinIndex);
            }
        });
    }

    /**
     * Checks collisions between character and collectible bottles.
     */
    checkBottleCollections() {
        this.world.level.bottles.forEach((bottle, bottleIndex) => {
            if (this.world.character.isColliding(bottle)) {
                this.collectBottle(bottleIndex);
            }
        });
    }

    /**
     * Applies damage to the character and updates health bar.
     */
    damageCharacter() {
        this.world.character.hit();
        this.world.statusBar.setPercentage(this.world.character.energy);
    }

    /**
     * Collects a coin and updates the coin status bar.
     * @param {number} coinIndex - Index of the coin to collect.
     */
    collectCoin(coinIndex) {
        sounds.coinCollect.currentTime = 0;
        playSound(sounds.coinCollect);
        this.world.character.coins++;
        this.world.level.coins.splice(coinIndex, 1);
        let percentage = (this.world.character.coins / this.world.character.maxCoins) * 100;
        this.world.statusBarCoin.setPercentage(percentage);
    }

    /**
     * Collects a bottle and updates the bottle status bar.
     * @param {number} bottleIndex - Index of the bottle to collect.
     */
    collectBottle(bottleIndex) {
        sounds.bottleCollect.currentTime = 0;
        playSound(sounds.bottleCollect);
        this.world.character.bottles++;
        this.world.level.bottles.splice(bottleIndex, 1);
        this.world.updateBottleStatusBar();
    }

    /**
     * Checks if character is jumping on an enemy from above.
     * @param {MovableObject} enemy - The enemy to check.
     * @returns {boolean} True if character is landing on enemy.
     */
    isJumpingOnEnemy(enemy) {
        return this.world.character.speedY < 0 && this.world.character.y < 120 && this.world.character.y < enemy.y - 50;
    }

    /**
     * Handles a bottle hitting an enemy.
     * @param {ThrowableObject} bottle - The thrown bottle.
     * @param {MovableObject} enemy - The enemy hit.
     * @param {number} bottleIndex - Index of the bottle.
     */
    handleBottleHit(bottle, enemy, bottleIndex) {
        if (this.isEndboss(enemy)) {
            this.damageEndboss(enemy);
        } else {
            this.killEnemy(enemy);
        }
        this.playBottleBreakSound();
        this.positionBottleSplash(bottle, enemy);
        bottle.splash();
        setTimeout(() => {
            this.world.throwableObjects.splice(bottleIndex, 1);
        }, 650);
    }

    /**
     * Checks if an enemy is the endboss.
     * @param {MovableObject} enemy - The enemy to check.
     * @returns {boolean} True if enemy is the endboss.
     */
    isEndboss(enemy) {
        return enemy.constructor.name == "Endboss";
    }

    /**
     * Damages the endboss and updates its health bar.
     * @param {Endboss} enemy - The endboss to damage.
     */
    damageEndboss(enemy) {
        enemy.hit();
        let percentage = (enemy.energy / 5) * 100;
        this.world.statusBarEndboss.setPercentage(percentage);
    }

    /**
     * Plays the bottle break sound effect.
     */
    playBottleBreakSound() {
        sounds.bottleBreaks.currentTime = 0;
        playSound(sounds.bottleBreaks);
    }

    /**
     * Positions the bottle splash animation on the enemy.
     * @param {ThrowableObject} bottle - The splashing bottle.
     * @param {MovableObject} enemy - The enemy that was hit.
     */
    positionBottleSplash(bottle, enemy) {
        let centerX = enemy.x + enemy.width / 2;
        let centerY = enemy.y + enemy.height / 2;
        let offsetLeft = enemy.offset?.left || 0;
        let offsetRight = enemy.offset?.right || 0;
        let offsetTop = enemy.offset?.top || 0;
        let offsetBottom = enemy.offset?.bottom || 0;
        let insetX = (enemy.width - offsetLeft - offsetRight) * 0.25;
        let insetY = enemy.constructor.name == "SmallChicken" ? 0 : (enemy.height - offsetTop - offsetBottom) * 0.25;
        bottle.x = bottle.x < centerX ? enemy.x + offsetLeft + insetX : enemy.x + enemy.width - offsetRight - bottle.width - insetX;
        bottle.y = bottle.y < centerY ? enemy.y + offsetTop + insetY : enemy.y + enemy.height - offsetBottom - bottle.height - insetY;
    }

    /**
     * Kills an enemy and removes it after delay.
     * @param {MovableObject} enemy - The enemy to kill.
     */
    killEnemy(enemy) {
        enemy.kill();
        setTimeout(() => {
            const index = this.world.level.enemies.indexOf(enemy);
            if (index > -1) {
                this.world.level.enemies.splice(index, 1);
            }
        }, 2000);
    }
}
