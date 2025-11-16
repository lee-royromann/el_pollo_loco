class World {
    character = new Character();
    level = level1;
    camera_x = 0;
    backgroundCache = {};
    statusBar = new StatusBar();
    statusBarCoin = new StatusBarCoin();
    statusBarBottle = new StatusBarBottle();
    throwableObjects = [];
    lastCharacterX = 100;
    lastSpawnTime = 0;

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
        }, 1000 / 60);
        setInterval(() => {
            this.checkThrowObjects();
        }, 120);
        setInterval(() => {
            this.checkEnemySpawn();
        }, 500);
    }

    setWorld() {
        this.character.world = this;
    }

    checkThrowObjects() {
        if (this.keyboard.D) {
            let direction = this.character.otherDirection ? -1 : 1;
            let bottle = new ThrowableObject(
                this.character.x + 50,
                this.character.y + 100,
                direction
            );
            this.throwableObjects.push(bottle);
        }
    }

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy) && !enemy.isDead) {
                if (enemy.constructor.name === 'Endboss') {
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
            if (enemy.constructor.name === "Chicken" && !enemy.isDead) {
                aliveChickens++;
            }
        });

        if (
            this.character.x < this.lastCharacterX &&
            aliveChickens < 5 &&
            timeSinceLastSpawn > 3000
        ) {
            let spawnX;
            if (Math.random() < 0.5) {
                spawnX = this.character.x + 800 + Math.random() * 400;
            } else {
                spawnX = this.character.x - 800 - Math.random() * 400;
            }
            
            if (spawnX > 0 && spawnX < this.level.level_end_x) {
                this.level.enemies.push(new Chicken(spawnX));
                this.lastSpawnTime = currentTime;
            }
        }

        this.lastCharacterX = this.character.x;
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

        this.ctx.translate(-this.camera_x, 0); // back
        // Space for fixed objects
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarBottle);
        this.ctx.translate(this.camera_x, 0); // forth

        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
        this.ctx.translate(-this.camera_x, 0);
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
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
        movableObject.drawFrame(this.ctx);
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
