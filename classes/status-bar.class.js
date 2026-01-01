/**
 * Health bar for the player.
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {
    percentage = 100;
    IMAGES = [
        "./img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png",
        "./img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
        "./img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
        "./img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
        "./img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
        "./img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
    ];

    /**
     * Creates the health status bar.
     */
    constructor() {
        super();
        this.loadImage(this.IMAGES[5]);
        this.loadImages(this.IMAGES);
        this.x = 20;
        this.y = 0;
        this.width = 200;
        this.height = 60;
    }

    /**
     * Sets the percentage and updates the displayed image.
     * @param {number} percentage - The current health percentage.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let imagePath = this.IMAGES[this.resolveImageIndex(percentage)];
        this.img = this.imageCache[imagePath];
    }

    /**
     * Resolves the image index based on percentage.
     * Shows empty bar (0%) only when health is actually zero.
     * @param {number} percentage - The current percentage value.
     * @returns {number} The index of the corresponding image.
     */
    resolveImageIndex(percentage) {
        if (percentage == 100) return 5;
        if (percentage >= 80) return 4;
        if (percentage >= 60) return 3;
        if (percentage >= 40) return 2;
        if (percentage >= 20) return 1;
        if (percentage > 0) return 1;
        return 0;
    }
}

/**
 * Status bar showing collected coins.
 * @extends DrawableObject
 */
class StatusBarCoin extends DrawableObject {
    percentage = 0;
    IMAGES = [
        "./img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png",
        "./img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png",
        "./img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png",
        "./img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png",
        "./img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png",
        "./img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png",
    ];

    /**
     * Creates the coin status bar.
     */
    constructor() {
        super();
        this.loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
        this.x = 20;
        this.y = 50;
        this.width = 200;
        this.height = 60;
    }

    /**
     * Sets the percentage and updates the displayed image.
     * @param {number} percentage - The current coin collection percentage.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let imagePath = this.IMAGES[this.resolveImageIndex(percentage)];
        this.img = this.imageCache[imagePath];
    }

    /**
     * Resolves the image index based on percentage.
     * @param {number} percentage - The current percentage value.
     * @returns {number} The index of the corresponding image.
     */
    resolveImageIndex(percentage) {
        if (percentage == 100) return 5;
        if (percentage > 80) return 4;
        if (percentage > 60) return 3;
        if (percentage > 40) return 2;
        if (percentage > 20) return 1;
        return 0;
    }
}

/**
 * Status bar showing collected bottles.
 * @extends DrawableObject
 */
class StatusBarBottle extends DrawableObject {
    percentage = 0;
    IMAGES = [
        "./img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png",
        "./img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png",
        "./img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png",
        "./img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png",
        "./img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png",
        "./img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png",
    ];

    /**
     * Creates the bottle status bar.
     */
    constructor() {
        super();
        this.loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
        this.x = 20;
        this.y = 100;
        this.width = 200;
        this.height = 60;
    }

    /**
     * Sets the percentage and updates the displayed image.
     * @param {number} percentage - The current bottle collection percentage.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let imagePath = this.IMAGES[this.resolveImageIndex(percentage)];
        this.img = this.imageCache[imagePath];
    }

    /**
     * Resolves the image index based on percentage.
     * @param {number} percentage - The current percentage value.
     * @returns {number} The index of the corresponding image.
     */
    resolveImageIndex(percentage) {
        if (percentage == 100) return 5;
        if (percentage > 80) return 4;
        if (percentage > 60) return 3;
        if (percentage > 40) return 2;
        if (percentage > 20) return 1;
        return 0;
    }
}

/**
 * Health bar for the endboss.
 * @extends DrawableObject
 */
class StatusBarEndboss extends DrawableObject {
    /**
     * Whether the status bar is visible.
     * @type {boolean}
     */
    visible = false;
    percentage = 100;
    IMAGES = [
        "./img/7_statusbars/2_statusbar_endboss/orange/orange0.png",
        "./img/7_statusbars/2_statusbar_endboss/orange/orange20.png",
        "./img/7_statusbars/2_statusbar_endboss/orange/orange40.png",
        "./img/7_statusbars/2_statusbar_endboss/orange/orange60.png",
        "./img/7_statusbars/2_statusbar_endboss/orange/orange80.png",
        "./img/7_statusbars/2_statusbar_endboss/orange/orange100.png",
    ];

    /**
     * Creates the endboss status bar.
     */
    constructor() {
        super();
        this.loadImage(this.IMAGES[5]);
        this.loadImages(this.IMAGES);
        this.x = 500;
        this.y = 8;
        this.width = 200;
        this.height = 60;
    }

    /**
     * Sets the percentage and updates the displayed image.
     * @param {number} percentage - The current endboss health percentage.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let imagePath = this.IMAGES[this.resolveImageIndex(percentage)];
        this.img = this.imageCache[imagePath];
    }

    /**
     * Resolves the image index based on percentage.
     * Shows empty bar (0%) only when health is actually zero.
     * @param {number} percentage - The current percentage value.
     * @returns {number} The index of the corresponding image.
     */
    resolveImageIndex(percentage) {
        if (percentage == 100) return 5;
        if (percentage >= 80) return 4;
        if (percentage >= 60) return 3;
        if (percentage >= 40) return 2;
        if (percentage >= 20) return 1;
        if (percentage > 0) return 1;
        return 0;
    }
}
