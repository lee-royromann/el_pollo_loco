/**
 * A game level with enemies, clouds, coins and bottles.
 */
class Level {
    enemies;
    clouds;
    coins;
    bottles;
    level_end_x = 5000;

    /**
     * Creates a new level.
     * @param {MovableObject[]} enemies - Array of enemy objects.
     * @param {Cloud[]} clouds - Array of cloud objects.
     * @param {Coin[]} coins - Array of coin objects.
     * @param {Bottle[]} bottles - Array of bottle objects.
     */
    constructor(enemies, clouds, coins, bottles) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.coins = coins;
        this.bottles = bottles;
    }
}
