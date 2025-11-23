class World {
    character = new Character();
    level = level1;
    camera_x = 0;
    backgroundCache = {};
    statusBar = new StatusBar();
    statusBarCoin = new StatusBarCoin();
    statusBarBottle = new StatusBarBottle();
    statusBarEndboss = new StatusBarEndboss();
    throwableObjects = [];
    lastCharacterX = 100;
    lastSpawnTime = 0;
    gameOverShown = false;

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.keyboard = keyboard;
        this.lastSpawnTime = new Date().getTime(); // Starte mit aktuellem Timestamp
        this.draw();
        this.setWorld();
        this.run();
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkBottleCollisions();
            this.checkCoinCollisions();
            this.checkBottleCollections();
        }, 1000 / 60);
        setInterval(() => {
            this.checkThrowObjects();
        }, 120);
        setInterval(() => {
            this.checkEnemySpawn();
        }, 500);
        this.scheduleNextCloudSpawn();
    }

    scheduleNextCloudSpawn() {
        const randomDelay = 10000 + Math.random() * 20000; // 5-25 Sekunden
        setTimeout(() => {
            this.spawnCloud();
            this.scheduleNextCloudSpawn();
        }, randomDelay);
    }

    setWorld() {
        this.character.world = this;
        let endboss = this.level.enemies.find(
            (enemy) => enemy.constructor.name === "Endboss"
        );
        if (endboss) {
            endboss.world = this;
        }
    }

    checkThrowObjects() {
        if (this.keyboard.D && this.character.bottles > 0) {
            let direction = this.character.otherDirection ? -1 : 1;
            let bottle = new ThrowableObject(
                this.character.x + 50,
                this.character.y + 100,
                direction
            );
            this.throwableObjects.push(bottle);
            this.character.bottles--;
            let percentage =
                (this.character.bottles / this.character.maxBottles) * 100;
            this.statusBarBottle.setPercentage(percentage);
            this.character.lastAction = new Date().getTime();
            sounds.characterThrow.currentTime = 0;
            sounds.characterThrow.play();
        }
    }

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy) && !enemy.isDead) {
                if (enemy.constructor.name === "Endboss") {
                    if (!this.character.isHurt()) {
                        this.character.hit();
                        this.statusBar.setPercentage(this.character.energy);
                    }
                } else if (this.isJumpingOnEnemy(enemy)) {
                    this.killEnemy(enemy);
                } else if (!this.character.isHurt()) {
                    this.character.hit();
                    this.statusBar.setPercentage(this.character.energy);
                }
            }
        });
    }

    checkBottleCollisions() {
        this.throwableObjects.forEach((bottle, bottleIndex) => {
            this.level.enemies.forEach((enemy) => {
                if (
                    bottle.isColliding(enemy) &&
                    !enemy.isDead &&
                    !bottle.isSplashing
                ) {
                    if (enemy.constructor.name === "Endboss") {
                        enemy.hit();
                        let percentage = (enemy.energy / 5) * 100;
                        this.statusBarEndboss.setPercentage(percentage);
                    } else {
                        this.killEnemy(enemy);
                    }
                    sounds.bottleBreaks.currentTime = 0;
                    sounds.bottleBreaks.play();

                    let enemyCenterX = enemy.x + enemy.width / 2;
                    let enemyCenterY = enemy.y + enemy.height / 2;
                    let offsetLeft = enemy.offset?.left || 0;
                    let offsetRight = enemy.offset?.right || 0;
                    let offsetTop = enemy.offset?.top || 0;
                    let offsetBottom = enemy.offset?.bottom || 0;

                    let availableWidth = enemy.width - offsetLeft - offsetRight;
                    let availableHeight =
                        enemy.height - offsetTop - offsetBottom;
                    let insetX = availableWidth * 0.25;
                    let insetY = availableHeight * 0.25;

                    if (enemy.constructor.name === "SmallChicken") {
                        insetY = 0;
                    }

                    if (bottle.x < enemyCenterX) {
                        bottle.x = enemy.x + offsetLeft + insetX;
                    } else {
                        bottle.x =
                            enemy.x +
                            enemy.width -
                            offsetRight -
                            bottle.width -
                            insetX;
                    }

                    if (bottle.y < enemyCenterY) {
                        bottle.y = enemy.y + offsetTop + insetY;
                    } else {
                        bottle.y =
                            enemy.y +
                            enemy.height -
                            offsetBottom -
                            bottle.height -
                            insetY;
                    }

                    bottle.splash();
                    setTimeout(() => {
                        this.throwableObjects.splice(bottleIndex, 1);
                    }, 650);
                }
            });
        });
    }

    checkCoinCollisions() {
        this.level.coins.forEach((coin, coinIndex) => {
            if (this.character.isColliding(coin)) {
                sounds.coinCollect.currentTime = 0;
                sounds.coinCollect.play();
                this.character.coins++;
                this.level.coins.splice(coinIndex, 1);
                let percentage =
                    (this.character.coins / this.character.maxCoins) * 100;
                this.statusBarCoin.setPercentage(percentage);
            }
        });
    }

    checkBottleCollections() {
        this.level.bottles.forEach((bottle, bottleIndex) => {
            if (this.character.isColliding(bottle)) {
                sounds.bottleCollect.currentTime = 0;
                sounds.bottleCollect.play();
                this.character.bottles++;
                this.level.bottles.splice(bottleIndex, 1);
                let percentage =
                    (this.character.bottles / this.character.maxBottles) * 100;
                this.statusBarBottle.setPercentage(percentage);
            }
        });
    }

    isJumpingOnEnemy(enemy) {
        return (
            this.character.speedY < 0 &&
            this.character.y < 120 &&
            this.character.y < enemy.y - 50
        );
    }

    killEnemy(enemy) {
        enemy.kill();
        setTimeout(() => {
            const index = this.level.enemies.indexOf(enemy);
            if (index > -1) {
                this.level.enemies.splice(index, 1);
            }
        }, 2000);
    }

    checkEnemySpawn() {
        let currentTime = new Date().getTime();
        let timeSinceLastSpawn = currentTime - this.lastSpawnTime;

        let aliveChickens = 0;
        this.level.enemies.forEach((enemy) => {
            if (
                (enemy.constructor.name === "Chicken" ||
                    enemy.constructor.name === "SmallChicken") &&
                !enemy.isDead
            ) {
                aliveChickens++;
            }
        });

        if (
            this.character.x < this.lastCharacterX &&
            aliveChickens < 8 &&
            timeSinceLastSpawn > 3000
        ) {
            let spawnX;
            if (Math.random() < 0.5) {
                spawnX = this.character.x + 800 + Math.random() * 400;
            } else {
                spawnX = this.character.x - 800 - Math.random() * 400;
            }

            if (spawnX > 0 && spawnX < this.level.level_end_x) {
                if (Math.random() < 0.5) {
                    this.level.enemies.push(new Chicken(spawnX));
                } else {
                    this.level.enemies.push(new SmallChicken(spawnX));
                }
                this.lastSpawnTime = currentTime;
            }
        }

        this.lastCharacterX = this.character.x;
    }

    spawnCloud() {
        const spawnX = -this.camera_x + this.canvas.width + 100;
        const randomY = 20 + Math.random() * 80; // Y btw 20 and 100
        const newCloud = new Cloud(spawnX);
        newCloud.y = randomY;
        this.level.clouds.push(newCloud);
        this.level.clouds = this.level.clouds.filter(
            (cloud) => cloud.x > -this.camera_x - 1000
        );
    }

    getVisibleBackgrounds() {
        const backgrounds = [];
        const tileWidth = 720;

        const startTile = Math.floor(-this.camera_x / tileWidth) - 1;
        const endTile =
            Math.ceil((-this.camera_x + this.canvas.width) / tileWidth) + 1;

        for (let i = startTile; i <= endTile; i++) {
            const xPos = i * tileWidth;
            const variant = Math.abs(i % 2) + 1;

            backgrounds.push(
                this.getCachedBackground(
                    `air_${i}`,
                    `./img/5_background/layers/air.png`,
                    xPos
                )
            );
            backgrounds.push(
                this.getCachedBackground(
                    `l3_${variant}_${i}`,
                    `./img/5_background/layers/3_third_layer/${variant}.png`,
                    xPos
                )
            );
            backgrounds.push(
                this.getCachedBackground(
                    `l2_${variant}_${i}`,
                    `./img/5_background/layers/2_second_layer/${variant}.png`,
                    xPos
                )
            );
            backgrounds.push(
                this.getCachedBackground(
                    `l1_${variant}_${i}`,
                    `./img/5_background/layers/1_first_layer/${variant}.png`,
                    xPos
                )
            );
        }
        return backgrounds;
    }

    getCachedBackground(key, path, xPos) {
        if (!this.backgroundCache[key]) {
            this.backgroundCache[key] = new BackgroundObject(path, xPos);
        } else {
            this.backgroundCache[key].x = xPos;
        }
        return this.backgroundCache[key];
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        const visibleBackgrounds = this.getVisibleBackgrounds();
        this.addObjectsToMap(visibleBackgrounds);
        this.addObjectsToMap(this.level.clouds);

        this.ctx.translate(-this.camera_x, 0); // back
        // Space for fixed objects
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarBottle);
        this.addToMap(this.statusBarEndboss);
        this.ctx.translate(this.camera_x, 0); // forth

        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);

        this.ctx.translate(-this.camera_x, 0);
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });

        // Update overlays after drawing
        this.updateGameOverOverlay();
    }

    updateGameOverOverlay() {
        if (!this.character) return;
        const overlay = document.getElementById("gameover-overlay");
        if (!overlay) return;
        if (this.character.isDead() && (this.character.deathAnimationDone || this.character.deathFrameIndex >= this.character.IMAGES_DEAD.length)) {
            if (!this.gameOverShown) {
                overlay.style.display = "flex";
                this.gameOverShown = true;
            }
        }
    }

    addObjectsToMap(objects) {
        objects.forEach((object) => {
            this.addToMap(object);
        });
    }

    addToMap(movableObject) {
        if (movableObject.otherDirection) {
            this.flipImage(movableObject);
        }
        movableObject.draw(this.ctx);
        if (movableObject.otherDirection) {
            this.flipImageBack(movableObject);
        }
    }

    flipImage(movableObject) {
        this.ctx.save();
        this.ctx.translate(movableObject.width, 0);
        this.ctx.scale(-1, 1);
        movableObject.x = movableObject.x * -1;
    }

    flipImageBack(movableObject) {
        this.ctx.restore();
        movableObject.x = movableObject.x * -1;
    }
}
