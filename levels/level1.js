/**
 * Creates and returns the first level with all game objects.
 * @returns {Level} The configured level instance.
 */
function createLevel1() {
    return new Level(
        createEnemies(),
        createClouds(),
        createCoins(),
        createBottles()
    );
}

/**
 * Creates the enemy array for level 1.
 * @returns {MovableObject[]} Array of enemies.
 */
function createEnemies() {
    return [
        new Chicken(), new Chicken(), new Chicken(), new Chicken(),
        new Chicken(), new Chicken(), new Chicken(), new Chicken(),
        new SmallChicken(), new SmallChicken(), new SmallChicken(),
        new SmallChicken(), new SmallChicken(), new SmallChicken(),
        new Endboss(),
    ];
}

/**
 * Creates the cloud array for level 1.
 * @returns {Cloud[]} Array of clouds.
 */
function createClouds() {
    return [
        new Cloud(200 + Math.random() * 300),
        new Cloud(700 + Math.random() * 300),
        new Cloud(1200 + Math.random() * 300),
        new Cloud(1800 + Math.random() * 300),
        new Cloud(2400 + Math.random() * 300),
        new Cloud(3000 + Math.random() * 300),
        new Cloud(3600 + Math.random() * 300),
        new Cloud(4200 + Math.random() * 300),
    ];
}

/**
 * Creates the coin array for level 1.
 * @returns {Coin[]} Array of coins.
 */
function createCoins() {
    let coins = [];
    let positions = [500, 800, 1100, 1400, 1700, 2000, 2300, 2600, 2900, 3200, 3500, 3800, 4100, 4400];
    positions.forEach(x => coins.push(new Coin(x + Math.random() * 200, 100 + Math.random() * 150)));
    return coins;
}

/**
 * Creates the bottle array for level 1.
 * @returns {Bottle[]} Array of bottles.
 */
function createBottles() {
    let bottles = [];
    let positions = [400, 700, 1000, 1300, 1600, 1900, 2200, 2500, 2800, 3100, 3400, 3700, 4000, 4300, 4600];
    positions.forEach(x => bottles.push(new Bottle(x + Math.random() * 200, 350)));
    return bottles;
}

const level1 = createLevel1();
