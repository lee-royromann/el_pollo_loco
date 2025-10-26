class MovableObject {
    img;
    x = 120;
    y = 250;
    height = 200;
    width = 100;
    imageCache = [];
    currentImage = 0;
    speed = 0.15;
    otherDirection = false;

    loadImage(imgPath) {
        this.img = new Image();
        this.img.src = imgPath; 
    }

    loadImages(array) {
        array.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }

    moveRight() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }
}