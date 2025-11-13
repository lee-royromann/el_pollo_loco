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
    constructor() {
        super();
        this.loadImage(this.IMAGES[5]);
        this.loadImages(this.IMAGES);
        this.x = 20;
        this.y = 0;
        this.width = 200;
        this.height = 60;
    }
    setPercentage(percentage) {
        this.percentage = percentage;
        let imagePath = this.IMAGES[this.resolveImageIndex(percentage)];
        this.img = this.imageCache[imagePath];
    }
    resolveImageIndex(percentage) {
        if (percentage == 100) return 5;
        if (percentage > 80) return 4;
        if (percentage > 60) return 3;
        if (percentage > 40) return 2;
        if (percentage > 20) return 1;
        return 0;
    }
}

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
    constructor() {
        super();
        this.loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
        this.x = 20;
        this.y = 50;
        this.width = 200;
        this.height = 60;
    }
    setPercentage(percentage) {
        this.percentage = percentage;
        let imagePath = this.IMAGES[this.resolveImageIndex(percentage)];
        this.img = this.imageCache[imagePath];
    }
    resolveImageIndex(percentage) {
        if (percentage == 100) return 5;
        if (percentage > 80) return 4;
        if (percentage > 60) return 3;
        if (percentage > 40) return 2;
        if (percentage > 20) return 1;
        return 0;
    }
}

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
    constructor() {
        super();
        this.loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
        this.x = 20;
        this.y = 100;
        this.width = 200;
        this.height = 60;
    }
    setPercentage(percentage) {
        this.percentage = percentage;
        let imagePath = this.IMAGES[this.resolveImageIndex(percentage)];
        this.img = this.imageCache[imagePath];
    }
    resolveImageIndex(percentage) {
        if (percentage == 100) return 5;
        if (percentage > 80) return 4;
        if (percentage > 60) return 3;
        if (percentage > 40) return 2;
        if (percentage > 20) return 1;
        return 0;
    }
}
