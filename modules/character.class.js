class Character extends MovableObject {

    constructor() {
        super().loadImage("../img/2_character_pepe/2_walk/W-21.png");
        this.x = 100;
        this.y = 120;
        this.height = 320;
        this.width = 160;
    }
    
    jump() {
        console.log("Character jumps");
    }
}