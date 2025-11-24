class Level {
    enemies;
    clouds;
    coins;
    bottles;
    level_end_x = 5000;

    constructor(enemies, clouds, coins, bottles) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.coins = coins;
        this.bottles = bottles;
    }
}
