class Level {
    enemies;
    clouds;
    coins;
    level_end_x = 5000;

    constructor(enemies, clouds, coins) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.coins = coins;
    }
}
