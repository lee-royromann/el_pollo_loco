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

sounds.backgroundMusic.volume = 0.04;
sounds.characterSnoring.volume = 1.0;
sounds.coinCollect.volume = 0.15;
sounds.bottleCollect.volume = 0.2;
sounds.characterWalking.volume = 0.3;
sounds.characterJump.volume = 0.2;
sounds.characterThrow.volume = 0.4;
sounds.bottleBreaks.volume = 0.4;
sounds.characterHurt.volume = 0.1;
sounds.characterDead.volume = 0.8;
sounds.characterWin.volume = 0.7;
sounds.chickenDead.volume = 0.2;
sounds.smallChickenDead.volume = 0.2;
sounds.endbossHurt.volume = 0.9;
sounds.endbossDead.volume = 0.9;

/**
 * Plays a sound if sound is enabled.
 * @param {HTMLAudioElement} sound - The audio element to play.
 */
window.playSound = function (sound) {
    if (soundEnabled && sound) {
        sound.play().catch(ignoreAutoplayError);
    }
};

/**
 * Ignores autoplay errors from browsers blocking audio.
 * Browsers block autoplay until user interaction - this is expected.
 */
function ignoreAutoplayError() {}

/**
 * Initializes the game when the page loads.
 */
window.addEventListener("load", () => {
    document.getElementById("loading-overlay").classList.add("hidden");
    initStartScreen();
    initGameHud();
    initResponsive();
    initTouchControls();
    initFullscreenButton();
});

/**
 * Initializes the start screen buttons and modals.
 */
function initStartScreen() {
    initStartButtons();
    initModalCloseHandlers();
    initGameEndButtons();
}

/**
 * Initializes start screen button listeners.
 */
function initStartButtons() {
    document.getElementById("start-btn").addEventListener("click", startGame);
    document.getElementById("keyboard-btn").addEventListener("click", () => {
        document.getElementById("keyboard-modal").classList.add("active");
    });
    document.getElementById("impressum-btn").addEventListener("click", () => {
        document.getElementById("impressum-modal").classList.add("active");
    });
    document.getElementById("sound-btn").addEventListener("click", toggleSound);
}

/**
 * Initializes modal close button handlers.
 * Modals can only be closed via the close button.
 */
function initModalCloseHandlers() {
    document.querySelectorAll(".modal-close").forEach((closeBtn) => {
        closeBtn.addEventListener("click", (e) => {
            e.target.closest(".modal").classList.remove("active");
        });
    });
}

/**
 * Initializes game end screen buttons (restart, home).
 */
function initGameEndButtons() {
    document.getElementById("restart-btn-gameover").addEventListener("click", restartGame);
    document.getElementById("restart-btn-win").addEventListener("click", restartGame);
    document.getElementById("home-btn-gameover").addEventListener("click", goToHome);
    document.getElementById("home-btn-win").addEventListener("click", goToHome);
}

/**
 * Initializes the in-game HUD buttons for sound, pause and exit.
 */
function initGameHud() {
    document.getElementById("sound-btn-game").addEventListener("click", toggleSound);
    document.getElementById("pause-btn-game").addEventListener("click", handlePauseClick);
    document.getElementById("home-btn-game").addEventListener("click", handleExitGame);
    document.getElementById("resume-btn").addEventListener("click", handleResumeClick);
    updateSoundIcons();
}

/**
 * Handles resume button click in pause overlay.
 */
function handleResumeClick() {
    if (world && world.isPaused) {
        world.togglePause();
    }
}

/**
 * Handles exit game button - returns to start screen.
 */
function handleExitGame() {
    if (world) {
        goToHome();
    }
}

/**
 * Handles pause button click during gameplay.
 */
function handlePauseClick() {
    if (world && !world.gameOverShown && !world.winShown) {
        world.togglePause();
    }
}

/**
 * Toggles sound on/off and updates all sound icons.
 */
function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem("soundEnabled", soundEnabled);
    updateSoundIcons();
    if (gameStarted) {
        if (soundEnabled) {
            sounds.backgroundMusic.play().catch(ignoreAutoplayError);
        } else {
            sounds.backgroundMusic.pause();
        }
    }
}

/**
 * Updates all sound icons based on current sound state.
 */
function updateSoundIcons() {
    const soundIcons = document.querySelectorAll(".icon-sound");
    soundIcons.forEach((icon) => {
        if (soundEnabled) {
            icon.classList.remove("muted");
        } else {
            icon.classList.add("muted");
        }
    });
}

/**
 * Starts the game and hides the start overlay.
 */
function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    document.getElementById("start-overlay").style.display = "none";
    document.getElementById("game-hud").classList.add("active");
    init();
    if (soundEnabled) {
        sounds.backgroundMusic.play().catch(ignoreAutoplayError);
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
    hideGameEndOverlays();
    if (world) world.stopGame();
    world = new World(canvas, keyboard);
    playBackgroundMusic();
}

/**
 * Hides game over and win overlays.
 */
function hideGameEndOverlays() {
    document.getElementById("gameover-overlay").style.display = "none";
    document.getElementById("win-overlay").style.display = "none";
}

/**
 * Plays background music from the start if sound is enabled.
 */
function playBackgroundMusic() {
    if (soundEnabled) {
        sounds.backgroundMusic.currentTime = 0;
        sounds.backgroundMusic.play().catch(ignoreAutoplayError);
    }
}

/**
 * Returns to the home screen and resets game state.
 */
function goToHome() {
    hideGameEndOverlays();
    document.getElementById("game-hud").classList.remove("active");
    stopCurrentGame();
    stopBackgroundMusic();
    gameStarted = false;
    document.getElementById("start-overlay").style.display = "flex";
}

/**
 * Stops and cleans up the current game world.
 */
function stopCurrentGame() {
    if (world) {
        world.stopGame();
        world = null;
    }
}

/**
 * Stops and resets background music.
 */
function stopBackgroundMusic() {
    if (sounds.backgroundMusic) {
        sounds.backgroundMusic.pause();
        sounds.backgroundMusic.currentTime = 0;
    }
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
 * Uses CSS transform scale for proper letterboxing.
 */
function resizeGame() {
    const wrapper = document.getElementById("game-wrapper");
    const container = document.getElementById("game-container");
    if (!wrapper || !container) return;
    
    const scale = calculateGameScale();
    applyGameScale(wrapper, container, scale);
}

/**
 * Calculates the appropriate scale factor for the game.
 * @returns {number} The scale factor.
 */
function calculateGameScale() {
    const isMobile = window.innerWidth <= 1024;
    const isFullscreen = !!document.fullscreenElement;
    const scaleX = window.innerWidth / 720;
    const scaleY = window.innerHeight / 480;
    return (isFullscreen || isMobile) ? Math.min(scaleX, scaleY) : Math.min(scaleX, scaleY, 1);
}

/**
 * Applies the scale to wrapper and container elements.
 * @param {HTMLElement} wrapper - The game wrapper element.
 * @param {HTMLElement} container - The game container element.
 * @param {number} scale - The scale factor to apply.
 */
function applyGameScale(wrapper, container, scale) {
    wrapper.style.width = `${Math.floor(720 * scale)}px`;
    wrapper.style.height = `${Math.floor(480 * scale)}px`;
    container.style.width = '720px';
    container.style.height = '480px';
    container.style.transform = `scale(${scale})`;
    container.style.transformOrigin = 'top left';
    container.style.left = '0';
    container.style.top = '0';
}

/**
 * Initializes touch controls for mobile devices.
 */
function initTouchControls() {
    const buttons = { "btn-left": "LEFT", "btn-right": "RIGHT", "btn-jump": "SPACE", "btn-throw": "D" };
    for (let id in buttons) {
        setupTouchButton(id, buttons[id]);
    }
}

/**
 * Sets up touch event listeners for a single button.
 * @param {string} id - Button element ID.
 * @param {string} key - Keyboard key to simulate.
 */
function setupTouchButton(id, key) {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener("touchstart", (e) => { e.preventDefault(); keyboard[key] = true; });
    btn.addEventListener("touchend", (e) => { e.preventDefault(); keyboard[key] = false; });
    btn.addEventListener("contextmenu", (e) => e.preventDefault());
}

/**
 * Initializes the fullscreen toggle button.
 */
function initFullscreenButton() {
    const btn = document.getElementById("fullscreen-btn");
    if (!btn) return;
    btn.addEventListener("click", toggleFullscreen);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
}

/**
 * Toggles fullscreen mode on/off.
 */
function toggleFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        document.documentElement.requestFullscreen();
    }
}

/**
 * Handles fullscreen state changes.
 */
function handleFullscreenChange() {
    document.body.classList.toggle("fullscreen-mode", !!document.fullscreenElement);
    resizeGame();
}
