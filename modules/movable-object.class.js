class MovableObject {
    x = 120;
    y = 250;
    img;
    height = 200;
    width = 100;

    loadImage(imgPath) {
        this.img = new Image();
        this.img.src = imgPath; 
    }

    moveLeft() {
        console.log("Moving left");
    }

    moveRight() {
        console.log("Moving right");
    }
}