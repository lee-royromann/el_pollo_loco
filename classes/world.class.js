/**
 * Main game world with all objects and game logic.
 */
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
    lastThrowTime = 0;
    throwCooldown = 700;
    throwKeyReleased = true;
    gameOverShown = false;
    winShown = false;
    isPaused = false;
    intervals = [];
    cloudTimeout = null;
    collisionHandler = null;

    /**
     * Creates the game world.
     * @param {HTMLCanvasElement} canvas - The canvas element.
     * @param {Keyboard} keyboard - The keyboard input handler.
     */
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

    /**
     * Starts all game loops for collisions, throws, and spawns.
     */
    run() {
        this.intervals.push(setInterval(() => { if (!this.isPaused) this.collisionHandler.checkAllCollisions(); }, 1000 / 60));
        this.intervals.push(setInterval(() => { if (!this.isPaused) this.checkThrowObjects(); }, 120));
        this.intervals.push(setInterval(() => { if (!this.isPaused) this.checkEnemySpawn(); }, 500));
        this.scheduleNextCloudSpawn();
    }

    /**
     * Stops all game intervals and clears timeouts.
     */
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

    /**
     * Pauses the game and shows pause overlay.
     */
    pauseGame() {
        if (this.isPaused || this.gameOverShown || this.winShown) return;
        this.isPaused = true;
        document.getElementById("pause-overlay").classList.add("active");
        if (typeof sounds != "undefined" && sounds.backgroundMusic && !sounds.backgroundMusic.paused) {
            sounds.backgroundMusic.pause();
        }
    }

    /**
     * Resumes the game from paused state.
     */
    resumeGame() {
        if (!this.isPaused) return;
        this.isPaused = false;
        document.getElementById("pause-overlay").classList.remove("active");
        if (soundEnabled && typeof sounds != "undefined" && sounds.backgroundMusic) {
            sounds.backgroundMusic.play().catch(ignoreAutoplayError);
        }
    }

    /**
     * Toggles pause state - pauses if running, resumes if paused.
     */
    togglePause() {
        if (this.isPaused) {
            this.resumeGame();
        } else {
            this.pauseGame();
        }
    }

    /**
     * Schedules the next cloud spawn with random delay.
     */
    scheduleNextCloudSpawn() {
        let randomDelay = 10000 + Math.random() * 20000;
        this.cloudTimeout = setTimeout(() => {
            this.spawnCloud();
            this.scheduleNextCloudSpawn();
        }, randomDelay);
    }

    /**
     * Sets world reference on character and endboss.
     */
    setWorld() {
        this.character.world = this;
        let endboss = this.level.enemies.find((enemy) => enemy.constructor.name == "Endboss");
        if (endboss) endboss.world = this;
    }

    /**
     * Checks if throw button is pressed and bottles available.
     */
    checkThrowObjects() {
        if (!this.keyboard.D) {
            this.throwKeyReleased = true;
        }
        if (this.keyboard.D && this.character.bottles > 0 && this.canThrow() && this.throwKeyReleased) {
            this.throwBottle();
            this.throwKeyReleased = false;
        }
    }

    /**
     * Checks if enough time has passed since last throw.
     * @returns {boolean} True if cooldown has passed.
     */
    canThrow() {
        let currentTime = new Date().getTime();
        return currentTime - this.lastThrowTime > this.throwCooldown;
    }

    /**
     * Creates and throws a bottle in the character's facing direction.
     */
    throwBottle() {
        this.lastThrowTime = new Date().getTime();
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

    /**
     * Updates the bottle status bar based on collected bottles.
     */
    updateBottleStatusBar() {
        let percentage = (this.character.bottles / this.character.maxBottles) * 100;
        this.statusBarBottle.setPercentage(percentage);
    }

    /**
     * Checks conditions and spawns new enemies if needed.
     */
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

    /**
     * Counts living chicken enemies.
     * @returns {number} Number of alive chickens.
     */
    countAliveChickens() {
        let aliveChickens = 0;
        this.level.enemies.forEach((enemy) => {
            if (this.isNormalChicken(enemy) && !enemy.isDead) {
                aliveChickens++;
            }
        });
        return aliveChickens;
    }

    /**
     * Checks if enemy is a normal chicken type.
     * @param {MovableObject} enemy - The enemy to check.
     * @returns {boolean} True if enemy is a chicken.
     */
    isNormalChicken(enemy) {
        return enemy.constructor.name == "Chicken" || enemy.constructor.name == "SmallChicken";
    }

    /**
     * Determines if a new enemy should spawn.
     * @param {number} aliveChickens - Current alive chicken count.
     * @param {number} timeSinceLastSpawn - Time since last spawn in ms.
     * @returns {boolean} True if spawn conditions are met.
     */
    shouldSpawnEnemy(aliveChickens, timeSinceLastSpawn) {
        return this.character.x < this.lastCharacterX && aliveChickens < 8 && timeSinceLastSpawn > 3000;
    }

    /**
     * Spawns a random chicken at calculated position.
     */
    spawnRandomChicken() {
        let spawnX = this.calculateSpawnPosition();
        if (spawnX > 0 && spawnX < this.level.level_end_x) {
            let newEnemy = Math.random() < 0.5 ? new Chicken(spawnX) : new SmallChicken(spawnX);
            this.level.enemies.push(newEnemy);
        }
    }

    /**
     * Calculates spawn position left or right of character.
     * @returns {number} The x coordinate for spawning.
     */
    calculateSpawnPosition() {
        return Math.random() < 0.5 ? this.character.x + 800 + Math.random() * 400 : this.character.x - 800 - Math.random() * 400;
    }

    /**
     * Spawns a new cloud at screen edge.
     */
    spawnCloud() {
        let spawnX = -this.camera_x + this.canvas.width + 100;
        let randomY = 20 + Math.random() * 80;
        let newCloud = new Cloud(spawnX);
        newCloud.y = randomY;
        newCloud.world = this;
        this.level.clouds.push(newCloud);
        this.removeOldClouds();
    }

    /**
     * Removes clouds that are off screen.
     */
    removeOldClouds() {
        this.level.clouds = this.level.clouds.filter((cloud) => cloud.x > -this.camera_x - 1000);
    }

    /**
     * Gets background tiles visible on screen.
     * @returns {BackgroundObject[]} Array of visible backgrounds.
     */
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

    /**
     * Adds background layers for a tile position.
     * @param {BackgroundObject[]} backgrounds - Array to add to.
     * @param {number} i - Tile index.
     * @param {number} tileWidth - Width of each tile.
     */
    addBackgroundTile(backgrounds, i, tileWidth) {
        let xPos = i * tileWidth;
        let variant = Math.abs(i % 2) + 1;
        backgrounds.push(this.getCachedBackground(`air_${i}`, `./img/5_background/layers/air.png`, xPos));
        backgrounds.push(this.getCachedBackground(`l3_${variant}_${i}`, `./img/5_background/layers/3_third_layer/${variant}.png`, xPos));
        backgrounds.push(this.getCachedBackground(`l2_${variant}_${i}`, `./img/5_background/layers/2_second_layer/${variant}.png`, xPos));
        backgrounds.push(this.getCachedBackground(`l1_${variant}_${i}`, `./img/5_background/layers/1_first_layer/${variant}.png`, xPos));
    }

    /**
     * Gets a background from cache or creates a new one.
     * @param {string} key - Cache key.
     * @param {string} path - Image path.
     * @param {number} xPos - X position.
     * @returns {BackgroundObject} The background object.
     */
    getCachedBackground(key, path, xPos) {
        if (!this.backgroundCache[key]) {
            this.backgroundCache[key] = new BackgroundObject(path, xPos);
        } else {
            this.backgroundCache[key].x = xPos;
        }
        return this.backgroundCache[key];
    }

    /**
     * Main draw loop.
     */
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

    /**
     * Draws background and clouds with camera offset.
     */
    drawWorld() {
        this.ctx.translate(this.camera_x, 0);
        let visibleBackgrounds = this.getVisibleBackgrounds();
        this.addObjectsToMap(visibleBackgrounds);
        this.addObjectsToMap(this.level.clouds);
    }

    /**
     * Draws status bars without camera offset.
     */
    drawUI() {
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarBottle);
        if (this.statusBarEndboss.visible) {
            this.addToMap(this.statusBarEndboss);
        }
        this.ctx.translate(this.camera_x, 0);
    }

    /**
     * Draws all game objects in the world.
     */
    drawGameObjects() {
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
    }

    /**
     * Updates game over overlay when character dies.
     */
    updateGameOverOverlay() {
        if (!this.character) return;
        let overlay = document.getElementById("gameover-overlay");
        if (!overlay) return;
        if (this.isCharacterDeathComplete() && !this.gameOverShown) {
            this.showGameOverScreen(overlay);
        }
    }

    /**
     * Checks if character death animation is complete.
     * @returns {boolean} True if death animation finished.
     */
    isCharacterDeathComplete() {
        return this.character.isDead() && (this.character.deathAnimationDone || this.character.deathFrameIndex >= this.character.IMAGES_DEAD.length);
    }

    /**
     * Shows game over screen and stops the game.
     * @param {HTMLElement} overlay - The game over overlay element.
     */
    showGameOverScreen(overlay) {
        overlay.style.display = "flex";
        this.gameOverShown = true;
        this.stopGame();
        this.stopBackgroundMusic();
    }

    /**
     * Stops and resets the background music.
     */
    stopBackgroundMusic() {
        if (typeof sounds != "undefined" && sounds.backgroundMusic) {
            sounds.backgroundMusic.pause();
            sounds.backgroundMusic.currentTime = 0;
        }
    }

    /**
     * Updates win overlay when endboss is defeated.
     */
    updateWinOverlay() {
        let endboss = this.findEndboss();
        if (!endboss) return;
        let overlay = document.getElementById("win-overlay");
        if (!overlay) return;
        if (endboss.isDead && endboss.deathAnimationPlayed && !this.winShown) {
            this.showWinScreen(overlay);
        }
    }

    /**
     * Finds the endboss in the enemies array.
     * @returns {Endboss|undefined} The endboss or undefined.
     */
    findEndboss() {
        return this.level.enemies.find((enemy) => enemy.constructor.name == "Endboss");
    }

    /**
     * Shows win screen and stops the game.
     * @param {HTMLElement} overlay - The win overlay element.
     */
    showWinScreen(overlay) {
        overlay.style.display = "flex";
        this.winShown = true;
        this.stopGame();
        sounds.characterWin.currentTime = 0;
        playSound(sounds.characterWin);
        this.stopBackgroundMusic();
    }

    /**
     * Draws an array of objects to the canvas.
     * @param {DrawableObject[]} objects - Objects to draw.
     */
    addObjectsToMap(objects) {
        objects.forEach((object) => {
            this.addToMap(object);
        });
    }

    /**
     * Draws a single object, handles flipping if needed.
     * @param {DrawableObject} movableObject - Object to draw.
     */
    addToMap(movableObject) {
        if (movableObject.otherDirection) {
            this.flipImage(movableObject);
        }
        movableObject.draw(this.ctx);
        if (movableObject.otherDirection) {
            this.flipImageBack(movableObject);
        }
    }

    /**
     * Flips the canvas for mirrored drawing.
     * @param {DrawableObject} movableObject - Object to flip.
     */
    flipImage(movableObject) {
        this.ctx.save();
        this.ctx.translate(movableObject.width, 0);
        this.ctx.scale(-1, 1);
        movableObject.x = movableObject.x * -1;
    }

    /**
     * Restores the canvas after flipping.
     * @param {DrawableObject} movableObject - Object to restore.
     */
    flipImageBack(movableObject) {
        this.ctx.restore();
        movableObject.x = movableObject.x * -1;
    }
}