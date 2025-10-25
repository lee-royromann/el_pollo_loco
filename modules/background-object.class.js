class BackgroundObject extends MovableObject {

    constructor(imagePath) {
        super();
        this.loadImage(imagePath);
        this.x = 0;
        this.y = 0;
        this.height = 480;
        this.width = 720;
    }
}