class Coin extends MovableObject {
    IMAGES_COIN = ["./img/8_coin/coin_1.png", "./img/8_coin/coin_2.png"];
    rotationAngle = 0;

    constructor(x, y) {
        super().loadImage("./img/8_coin/coin_1.png");
        this.loadImages(this.IMAGES_COIN);
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.offset = {
            top: 30,
            bottom: 30,
            left: 30,
            right: 30,
        };
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.rotationAngle += 3;
            if (this.rotationAngle >= 360) {
                this.rotationAngle = 0;
            }
        }, 1000 / 60);
    }

    draw(ctx) {
        try {
            if (this.img && this.img.complete && this.img.naturalHeight > 0) {
                ctx.save();
                ctx.translate(
                    this.x + this.width / 2,
                    this.y + this.height / 2
                );

                let scaleX = Math.cos((this.rotationAngle * Math.PI) / 180);
                ctx.scale(scaleX, 1);

                ctx.drawImage(
                    this.img,
                    -this.width / 2,
                    -this.height / 2,
                    this.width,
                    this.height
                );
                ctx.restore();
            }
        } catch (e) {
            // Bild noch nicht geladen
        }
    }
}
