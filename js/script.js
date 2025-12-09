let canvas;
let world;
let keyboard = new Keyboard();
let soundEnabled = localStorage.getItem("soundEnabled") !== "false";
let gameStarted = false;

let sounds = {
    chickenDead: new Audio("audio/chicken_normal_hurt.wav"),
    smallChickenDead: new Audio("audio/chicken_small_hurt.wav"),
    endbossHurt: new Audio("audio/chicken_endboss_hurt.wav"),
    endbossDead: new Audio("audio/chicken_endboss_dead.wav"),
    characterHurt: new Audio("audio/character_hurt.wav"),
    characterDead: new Audio("audio/character_dead.wav"),
    bottleBreaks: new Audio("audio/bottle_breaks.wav"),
    characterWalking: new Audio("audio/character_walking.wav"),
    characterJump: new Audio("audio/character_jump.wav"),
    characterThrow: new Audio("audio/character_throw.wav"),
    characterSnoring: new Audio("audio/character_snoring.wav"),
    coinCollect: new Audio("audio/coin_collect.wav"),
    bottleCollect: new Audio("audio/bottle_collect.wav"),
    characterWin: new Audio("audio/character_win.wav"),
    backgroundMusic: new Audio("audio/background_music.wav"),
};

sounds.characterSnoring.loop = true;
sounds.backgroundMusic.loop = true;

sounds.backgroundMusic.volume = 0.3;
sounds.characterSnoring.volume = 0.3;
sounds.coinCollect.volume = 0.4;
sounds.bottleCollect.volume = 0.4;
sounds.characterWalking.volume = 0.5;
sounds.characterJump.volume = 0.5;
sounds.characterThrow.volume = 0.5;
sounds.bottleBreaks.volume = 0.5;
sounds.characterHurt.volume = 0.6;
sounds.characterDead.volume = 0.6;
sounds.characterWin.volume = 0.6;
sounds.chickenDead.volume = 0.5;
sounds.smallChickenDead.volume = 0.5;
sounds.endbossHurt.volume = 0.7;
sounds.endbossDead.volume = 0.7;

/**
 * Plays a sound if sound is enabled.
 * @param {HTMLAudioElement} sound - The audio element to play.
 */
window.playSound = function (sound) {
    if (soundEnabled && sound) {
        sound.play().catch(() => {});
    }
};

/**
 * Initializes the game when the page loads.
 */
window.addEventListener("load", () => {
    document.getElementById("loading-overlay").classList.add("hidden");
    initStartScreen();
    initResponsive();
    initTouchControls();
    initFullscreenButton();
});

/**
 * Initializes the start screen buttons and modals.
 */
function initStartScreen() {
    const startBtn = document.getElementById("start-btn");
    const keyboardBtn = document.getElementById("keyboard-btn");
    const soundBtn = document.getElementById("sound-btn");
    const keyboardModal = document.getElementById("keyboard-modal");

    if (!soundEnabled) {
        soundBtn.querySelector(".icon-sound").classList.add("muted");
    }

    startBtn.addEventListener("click", () => {
        startGame();
    });

    keyboardBtn.addEventListener("click", () => {
        keyboardModal.classList.add("active");
    });

    soundBtn.addEventListener("click", () => {
        soundEnabled = !soundEnabled;
        localStorage.setItem("soundEnabled", soundEnabled);
        const iconSvg = soundBtn.querySelector(".icon-sound");
        if (soundEnabled) {
            iconSvg.classList.remove("muted");
        } else {
            iconSvg.classList.add("muted");
        }
        if (gameStarted) {
            if (soundEnabled) {
                sounds.backgroundMusic
                    .play()
                    .catch(() => {});
            } else {
                sounds.backgroundMusic.pause();
            }
        }
    });

    document.querySelectorAll(".modal-close").forEach((closeBtn) => {
        closeBtn.addEventListener("click", (e) => {
            e.target.closest(".modal").classList.remove("active");
        });
    });

    document.querySelectorAll(".modal").forEach((modal) => {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("active");
            }
        });
    });

    document
        .getElementById("restart-btn-gameover")
        .addEventListener("click", restartGame);
    document
        .getElementById("restart-btn-win")
        .addEventListener("click", restartGame);
    document
        .getElementById("home-btn-gameover")
        .addEventListener("click", goToHome);
    document.getElementById("home-btn-win").addEventListener("click", goToHome);
}

/**
 * Starts the game and hides the start overlay.
 */
function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    document.getElementById("start-overlay").style.display = "none";
    init();
    if (soundEnabled) {
        sounds.backgroundMusic
            .play()
            .catch(() => {});
    }
}

/**
 * Initializes the canvas and creates the game world.
 */
function init() {
    if (!canvas) {
        canvas = document.getElementById("canvas");
    }
    world = new World(canvas, keyboard);
}

/**
 * Restarts the game from the beginning.
 */
function restartGame() {
    document.getElementById("gameover-overlay").style.display = "none";
    document.getElementById("win-overlay").style.display = "none";

    if (world) {
        world.stopGame();
    }

    world = new World(canvas, keyboard);

    if (soundEnabled) {
        sounds.backgroundMusic.currentTime = 0;
        sounds.backgroundMusic
            .play()
            .catch(() => {});
    }
}

/**
 * Returns to the home screen and resets game state.
 */
function goToHome() {
    document.getElementById("gameover-overlay").style.display = "none";
    document.getElementById("win-overlay").style.display = "none";

    if (world) {
        world.stopGame();
        world = null;
    }

    if (sounds.backgroundMusic) {
        sounds.backgroundMusic.pause();
        sounds.backgroundMusic.currentTime = 0;
    }

    gameStarted = false;
    document.getElementById("start-overlay").style.display = "flex";
}

/**
 * Handles keyboard key press events.
 */
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
        e.preventDefault();
        keyboard.SPACE = true;
    }
    if (e.key == "d" || e.key == "D") {
        keyboard.D = true;
    }
    if (
        (e.key == "Escape" || e.key == "p" || e.key == "P") &&
        world &&
        gameStarted
    ) {
        if (world.isPaused) {
            world.resumeGame();
        } else {
            world.pauseGame();
        }
    }
});

/**
 * Handles keyboard key release events.
 */
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
});

/**
 * Initializes responsive behavior for game scaling.
 */
function initResponsive() {
    resizeGame();
    window.addEventListener("resize", resizeGame);
    window.addEventListener("orientationchange", resizeGame);
}

/**
 * Resizes the game container based on window size.
 */
function resizeGame() {
    const wrapper = document.getElementById("game-wrapper");
    const container = document.getElementById("game-container");
    if (!wrapper || !container) return;

    const scale = Math.min(
        window.innerWidth / 720,
        window.innerHeight / 480,
        document.fullscreenElement ? 999 : 1
    );
    container.style.transform = `scale(${scale})`;
    wrapper.style.width = `${720 * scale}px`;
    wrapper.style.height = `${480 * scale}px`;
}

/**
 * Initializes touch controls for mobile devices.
 */
function initTouchControls() {
    const buttons = {
        "btn-left": "LEFT",
        "btn-right": "RIGHT",
        "btn-jump": "SPACE",
        "btn-throw": "D",
    };

    for (let id in buttons) {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener("touchstart", (e) => {
                e.preventDefault();
                keyboard[buttons[id]] = true;
            });
            btn.addEventListener("touchend", (e) => {
                e.preventDefault();
                keyboard[buttons[id]] = false;
            });
            btn.addEventListener("contextmenu", (e) => {
                e.preventDefault();
            });
        }
    }
}

/**
 * Initializes the fullscreen toggle button.
 */
function initFullscreenButton() {
    const btn = document.getElementById("fullscreen-btn");
    if (!btn) return;

    btn.addEventListener("click", () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
    });

    document.addEventListener("fullscreenchange", () => {
        document.body.classList.toggle(
            "fullscreen-mode",
            !!document.fullscreenElement
        );
        resizeGame();
    });
}
