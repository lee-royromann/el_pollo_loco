class World {
    character = new Character();
    level = level1;
    camera_x = 0;
    backgroundCache = {};

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.checkCollisions();
    }

    setWorld() {
        this.character.world = this;
    }

    checkCollisions() {
        setInterval(() => {
            this.level.enemies.forEach((enemy) => {
                if (this.character.isColliding(enemy)) {
                    this.character.hit();
                    console.log(
                        "Collision with enemy detected!",
                        enemy,
                        "Character energy:",
                        this.character.energy
                    );
                }
            });
        }, 500);
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
        this.addObjectsToMap(this.level.enemies);
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
