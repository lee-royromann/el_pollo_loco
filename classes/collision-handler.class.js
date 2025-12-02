class CollisionHandler {
    constructor(world) {
        this.world = world;
    }

    checkAllCollisions() {
        this.checkEnemyCollisions();
        this.checkBottleCollisions();
        this.checkCoinCollisions();
        this.checkBottleCollections();
    }

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

    checkBottleCollisions() {
        this.world.throwableObjects.forEach((bottle, bottleIndex) => {
            this.world.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy) && !enemy.isDead && !bottle.isSplashing) {
                    this.handleBottleHit(bottle, enemy, bottleIndex);
                }
            });
        });
    }

    checkCoinCollisions() {
        this.world.level.coins.forEach((coin, coinIndex) => {
            if (this.world.character.isColliding(coin)) {
                this.collectCoin(coinIndex);
            }
        });
    }

    checkBottleCollections() {
        this.world.level.bottles.forEach((bottle, bottleIndex) => {
            if (this.world.character.isColliding(bottle)) {
                this.collectBottle(bottleIndex);
            }
        });
    }

    damageCharacter() {
        this.world.character.hit();
        this.world.statusBar.setPercentage(this.world.character.energy);
    }

    collectCoin(coinIndex) {
        sounds.coinCollect.currentTime = 0;
        playSound(sounds.coinCollect);
        this.world.character.coins++;
        this.world.level.coins.splice(coinIndex, 1);
        let percentage = (this.world.character.coins / this.world.character.maxCoins) * 100;
        this.world.statusBarCoin.setPercentage(percentage);
    }

    collectBottle(bottleIndex) {
        sounds.bottleCollect.currentTime = 0;
        playSound(sounds.bottleCollect);
        this.world.character.bottles++;
        this.world.level.bottles.splice(bottleIndex, 1);
        this.world.updateBottleStatusBar();
    }

    isJumpingOnEnemy(enemy) {
        return this.world.character.speedY < 0 && this.world.character.y < 120 && this.world.character.y < enemy.y - 50;
    }

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

    isEndboss(enemy) {
        return enemy.constructor.name == "Endboss";
    }

    damageEndboss(enemy) {
        enemy.hit();
        let percentage = (enemy.energy / 5) * 100;
        this.world.statusBarEndboss.setPercentage(percentage);
    }

    playBottleBreakSound() {
        sounds.bottleBreaks.currentTime = 0;
        playSound(sounds.bottleBreaks);
    }

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
