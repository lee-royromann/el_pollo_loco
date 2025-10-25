class Character extends MovableObject {

    constructor() {
        super().loadImage("../img/2_character_pepe/2_walk/W-21.png");
        this.x = 100;
        this.y = 130;
        this.height = 330;
        this.width = 180;
    }
    
    jump() {
        console.log("Character jumps");
    }
}