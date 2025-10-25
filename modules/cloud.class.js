class Cloud extends MovableObject {

    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.y = 30;
        this.x = Math.random() * 800
        this.height = 250;
        this.width = 400;
        this.move();
    }

    move() {
        setInterval(() => {
            this.x -= 0.15;
        }, 1000 / 60);
    }
}