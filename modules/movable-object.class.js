class MovableObject {
    x = 120;
    y = 250;
    img;
    height = 200;
    width = 100;
    imageCache = [];
    currentImage = 0;
    speed = 0.15;

    loadImage(imgPath) {
        this.img = new Image();
        this.img.src = imgPath; 
    }

    /**
     * 
     * @param {*} array 
     */
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
        console.log("Moving right");
    }
}