class MovableObject {
    x = 120;
    y = 250;
    img;
    height = 200;
    width = 100;
    imageCache = [];
    currentImage = 0;

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
        console.log("Moving left");
    }

    moveRight() {
        console.log("Moving right");
    }
}