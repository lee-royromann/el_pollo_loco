class World {
    character = new Character();
    level = createLevel1();
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
    winShown = false;
    isPaused = false;
    intervals = [];
    cloudTimeout = null;
    collisionHandler = null;

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.keyboard = keyboard;
        this.collisionHandler = new CollisionHandler(this);
        this.lastSpawnTime = new Date().getTime();
        this.draw();
        this.setWorld();
        this.run();
    }

    run() {
        this.intervals.push(setInterval(() => { if (!this.isPaused) this.collisionHandler.checkAllCollisions(); }, 1000 / 60));
        this.intervals.push(setInterval(() => { if (!this.isPaused) this.checkThrowObjects(); }, 120));
        this.intervals.push(setInterval(() => { if (!this.isPaused) this.checkEnemySpawn(); }, 500));
        this.scheduleNextCloudSpawn();
    }

    stopGame() {
        this.intervals.forEach((interval) => clearInterval(interval));
        this.intervals = [];
        if (this.cloudTimeout) {
            clearTimeout(this.cloudTimeout);
            this.cloudTimeout = null;
        }
        if (this.character) {
            this.character.stopMoving();
        }
    }

    pauseGame() {
        if (this.isPaused || this.gameOverShown || this.winShown) return;
        this.isPaused = true;
        document.getElementById("pause-overlay").classList.add("active");
        if (typeof sounds != "undefined" && sounds.backgroundMusic && !sounds.backgroundMusic.paused) {
            sounds.backgroundMusic.pause();
        }
    }

    resumeGame() {
        if (!this.isPaused) return;
        this.isPaused = false;
        document.getElementById("pause-overlay").classList.remove("active");
        if (soundEnabled && typeof sounds != "undefined" && sounds.backgroundMusic) {
            sounds.backgroundMusic.play().catch(() => {});
        }
    }

    scheduleNextCloudSpawn() {
        let randomDelay = 10000 + Math.random() * 20000;
        this.cloudTimeout = setTimeout(() => {
            this.spawnCloud();
            this.scheduleNextCloudSpawn();
        }, randomDelay);
    }

    setWorld() {
        this.character.world = this;
        let endboss = this.level.enemies.find((enemy) => enemy.constructor.name == "Endboss");
        if (endboss) endboss.world = this;
    }

    checkThrowObjects() {
        if (this.keyboard.D && this.character.bottles > 0) {
            this.throwBottle();
        }
    }

    throwBottle() {
        let direction = this.character.otherDirection ? -1 : 1;
        let bottle = new ThrowableObject(this.character.x + 50, this.character.y + 100, direction);
        bottle.world = this;
        this.throwableObjects.push(bottle);
        this.character.bottles--;
        this.updateBottleStatusBar();
        this.character.lastAction = new Date().getTime();
        sounds.characterThrow.currentTime = 0;
        playSound(sounds.characterThrow);
    }

    updateBottleStatusBar() {
        let percentage = (this.character.bottles / this.character.maxBottles) * 100;
        this.statusBarBottle.setPercentage(percentage);
    }

    checkEnemySpawn() {
        let currentTime = new Date().getTime();
        let timeSinceLastSpawn = currentTime - this.lastSpawnTime;
        let aliveChickens = this.countAliveChickens();

        if (this.shouldSpawnEnemy(aliveChickens, timeSinceLastSpawn)) {
            this.spawnRandomChicken();
            this.lastSpawnTime = currentTime;
        }
        this.lastCharacterX = this.character.x;
    }

    countAliveChickens() {
        let aliveChickens = 0;
        this.level.enemies.forEach((enemy) => {
            if (this.isNormalChicken(enemy) && !enemy.isDead) {
                aliveChickens++;
            }
        });
        return aliveChickens;
    }

    isNormalChicken(enemy) {
        return enemy.constructor.name == "Chicken" || enemy.constructor.name == "SmallChicken";
    }

    shouldSpawnEnemy(aliveChickens, timeSinceLastSpawn) {
        return this.character.x < this.lastCharacterX && aliveChickens < 8 && timeSinceLastSpawn > 3000;
    }

    spawnRandomChicken() {
        let spawnX = this.calculateSpawnPosition();
        if (spawnX > 0 && spawnX < this.level.level_end_x) {
            let newEnemy = Math.random() < 0.5 ? new Chicken(spawnX) : new SmallChicken(spawnX);
            this.level.enemies.push(newEnemy);
        }
    }

    calculateSpawnPosition() {
        return Math.random() < 0.5 ? this.character.x + 800 + Math.random() * 400 : this.character.x - 800 - Math.random() * 400;
    }

    spawnCloud() {
        let spawnX = -this.camera_x + this.canvas.width + 100;
        let randomY = 20 + Math.random() * 80;
        let newCloud = new Cloud(spawnX);
        newCloud.y = randomY;
        newCloud.world = this;
        this.level.clouds.push(newCloud);
        this.removeOldClouds();
    }

    removeOldClouds() {
        this.level.clouds = this.level.clouds.filter((cloud) => cloud.x > -this.camera_x - 1000);
    }

    getVisibleBackgrounds() {
        let backgrounds = [];
        let tileWidth = 720;
        let startTile = Math.floor(-this.camera_x / tileWidth) - 1;
        let endTile = Math.ceil((-this.camera_x + this.canvas.width) / tileWidth) + 1;
        for (let i = startTile; i <= endTile; i++) {
            this.addBackgroundTile(backgrounds, i, tileWidth);
        }
        return backgrounds;
    }

    addBackgroundTile(backgrounds, i, tileWidth) {
        let xPos = i * tileWidth;
        let variant = Math.abs(i % 2) + 1;
        backgrounds.push(this.getCachedBackground(`air_${i}`, `./img/5_background/layers/air.png`, xPos));
        backgrounds.push(this.getCachedBackground(`l3_${variant}_${i}`, `./img/5_background/layers/3_third_layer/${variant}.png`, xPos));
        backgrounds.push(this.getCachedBackground(`l2_${variant}_${i}`, `./img/5_background/layers/2_second_layer/${variant}.png`, xPos));
        backgrounds.push(this.getCachedBackground(`l1_${variant}_${i}`, `./img/5_background/layers/1_first_layer/${variant}.png`, xPos));
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
        this.drawWorld();
        this.drawUI();
        this.drawGameObjects();
        this.ctx.translate(-this.camera_x, 0);
        let self = this;
        requestAnimationFrame(function() { self.draw(); });
        this.updateGameOverOverlay();
        this.updateWinOverlay();
    }

    drawWorld() {
        this.ctx.translate(this.camera_x, 0);
        let visibleBackgrounds = this.getVisibleBackgrounds();
        this.addObjectsToMap(visibleBackgrounds);
        this.addObjectsToMap(this.level.clouds);
    }

    drawUI() {
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarBottle);
        this.addToMap(this.statusBarEndboss);
        this.ctx.translate(this.camera_x, 0);
    }

    drawGameObjects() {
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
    }

    updateGameOverOverlay() {
        if (!this.character) return;
        let overlay = document.getElementById("gameover-overlay");
        if (!overlay) return;
        if (this.isCharacterDeathComplete() && !this.gameOverShown) {
            this.showGameOverScreen(overlay);
        }
    }

    isCharacterDeathComplete() {
        return this.character.isDead() && (this.character.deathAnimationDone || this.character.deathFrameIndex >= this.character.IMAGES_DEAD.length);
    }

    showGameOverScreen(overlay) {
        overlay.style.display = "flex";
        this.gameOverShown = true;
        this.stopGame();
        this.stopBackgroundMusic();
    }

    stopBackgroundMusic() {
        if (typeof sounds != "undefined" && sounds.backgroundMusic) {
            sounds.backgroundMusic.pause();
            sounds.backgroundMusic.currentTime = 0;
        }
    }

    updateWinOverlay() {
        let endboss = this.findEndboss();
        if (!endboss) return;
        let overlay = document.getElementById("win-overlay");
        if (!overlay) return;
        if (endboss.isDead && endboss.deathAnimationPlayed && !this.winShown) {
            this.showWinScreen(overlay);
        }
    }

    findEndboss() {
        return this.level.enemies.find((enemy) => enemy.constructor.name == "Endboss");
    }

    showWinScreen(overlay) {
        overlay.style.display = "flex";
        this.winShown = true;
        this.stopGame();
        sounds.characterWin.currentTime = 0;
        playSound(sounds.characterWin);
        this.stopBackgroundMusic();
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