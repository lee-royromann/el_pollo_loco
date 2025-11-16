class Cloud extends MovableObject {
    constructor(x = Math.random() * 800) {
        super().loadImage("./img/5_background/layers/4_clouds/1.png");
        this.y = 30;
        this.x = x;
        this.height = 250;
        this.width = 400;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }
}
