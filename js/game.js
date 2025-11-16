let canvas;
let world;
let keyboard = new Keyboard();

let sounds = {
    chickenDead: new Audio("audio/chicken_normal_hurt.wav"),
    smallChickenDead: new Audio("audio/chicken_small_hurt.wav"),
    endbossDead: new Audio("audio/chicken_endboss_hurt.wav"),
    characterHurt: new Audio("audio/character_hurt.wav"),
};

function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);
    ctx = canvas.getContext("2d");
}

window.addEventListener("keydown", (e) => {
    if (e.key == "ArrowLeft") {
        keyboard.LEFT = true;
    }
    if (e.key == "ArrowRight") {
        keyboard.RIGHT = true;
    }
    if (e.key == "ArrowUp") {
        keyboard.UP = true;
    }
    if (e.key == " ") {
        keyboard.SPACE = true;
    }
    if (e.key == "d" || e.key == "D") {
        keyboard.D = true;
    }
    console.log(keyboard);
});

window.addEventListener("keyup", (e) => {
    if (e.key == "ArrowLeft") {
        keyboard.LEFT = false;
    }
    if (e.key == "ArrowRight") {
        keyboard.RIGHT = false;
    }
    if (e.key == "ArrowUp") {
        keyboard.UP = false;
    }
    if (e.key == " ") {
        keyboard.SPACE = false;
    }
    if (e.key == "d" || e.key == "D") {
        keyboard.D = false;
    }
    console.log(keyboard);
});
