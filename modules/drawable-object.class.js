class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 150;
    height = 150;
    width = 100;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    draw(ctx) {
        if (this.img) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }

    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken) {
            ctx.beginPath();
            ctx.lineWidth = "3";
            ctx.strokeStyle = "blue";
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.lineWidth = "3";
            ctx.strokeStyle = "red";
            ctx.rect(
                this.x + this.offset.left,
                this.y + this.offset.top,
                this.width - this.offset.left - this.offset.right,
                this.height - this.offset.top - this.offset.bottom
            );
            ctx.stroke();
        }
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}
