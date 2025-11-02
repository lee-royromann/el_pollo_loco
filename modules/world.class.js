class World {
    character = new Character();
    enemies = [
        new Chicken(),
        new Chicken(),
        new Chicken()
    ];
    clouds = [
        new Cloud()
    ];
    camera_x = 0;
    backgroundCache = {};

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
    }

    setWorld() {
        this.character.world = this;
    }

    getVisibleBackgrounds() {
        const backgrounds = [];
        const tileWidth = 720;
        const startTile = Math.floor(-this.camera_x / tileWidth) - 1;
        const endTile = Math.ceil((-this.camera_x + this.canvas.width) / tileWidth) + 1;
        const layers = [
            "./img/5_background/layers/air.png",
            "./img/5_background/layers/3_third_layer/",
            "./img/5_background/layers/2_second_layer/",
            "./img/5_background/layers/1_first_layer/"
        ];

        for (let i = startTile; i <= endTile; i++) {
            const xPos = i * tileWidth;

            // This will alternate between variant 1 and 2
            const variant = Math.abs(i % 2) + 1;

            // Cache keys for every layer position
            const cacheKeys = [
                `air_${i}`,
                `layer3_${variant}_${i}`,
                `layer2_${variant}_${i}`,
                `layer1_${variant}_${i}`
            ];

            const imagePaths = [
                layers[0],
                layers[1] + variant + ".png",
                layers[2] + variant + ".png",
                layers[3] + variant + ".png"
            ];

            imagePaths.forEach((path, index) => {
                const cacheKey = cacheKeys[index];
                // If not in cache, create new BackgroundObject
                if (!this.backgroundCache[cacheKey]) {
                    this.backgroundCache[cacheKey] = new BackgroundObject(path, xPos);
                } else {
                    // Update only the position
                    this.backgroundCache[cacheKey].x = xPos;
                }
                backgrounds.push(this.backgroundCache[cacheKey]);
            });
        }
        return backgrounds;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        const visibleBackgrounds = this.getVisibleBackgrounds();
        this.addObjectsToMap(visibleBackgrounds);
        this.addObjectsToMap(this.clouds);
        this.addObjectsToMap(this.enemies);
        this.addToMap(this.character);
        this.ctx.translate(-this.camera_x, 0);
        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach(object => {
            this.addToMap(object);
        });
    }

    addToMap(movableObject) {
        if (movableObject.otherDirection) {
            this.ctx.save();
            this.ctx.translate(movableObject.width, 0);
            this.ctx.scale(-1, 1);
            movableObject.x = movableObject.x * -1;
        }
        this.ctx.drawImage(
            movableObject.img,
            movableObject.x,
            movableObject.y,
            movableObject.width,
            movableObject.height
        );
        if (movableObject.otherDirection) {
            movableObject.x = movableObject.x * -1;
            this.ctx.restore();
        }
    }
}