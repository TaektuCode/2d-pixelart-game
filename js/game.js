/**
 * @file Initializes the game, handles keyboard and touch events, manages game states,
 * and controls screen transitions.
 */

let canvas;
let world;
let keyboard = new Keyboard();
let screenManager;
let level1;
let gameIsOver = false;
let gameIsWon = false;
let musicPlaying = false;
const muteButton = document.getElementById("muteButton");
const muteIcon = document.getElementById("muteIcon");

/**
 * Initializes the game by setting up the canvas, screen manager, event listeners,
 * and initial music.
 */
function init() {
  canvas = document.getElementById("canvas");
  screenManager = new ScreenManager(canvas, startGame);
  window.addEventListener("keydown", keyboardKeyDown);
  window.addEventListener("keyup", keyboardKeyUp);
  window.addEventListener("resize", resizeCanvas);
  window.onload = () => {
    initializeMuteButton();
    if (!musicPlaying) {
      AudioHub.playLoopingSound(AudioHub.STARTSCREEN_MUSIC);
      musicPlaying = true;
    }
  };
  bindTouchEvents();
}

/**
 * Handles resizing of the canvas and updates the active screen if necessary.
 */
function resizeCanvas() {
  if (
    screenManager &&
    screenManager.activeScreen &&
    typeof screenManager.activeScreen.handleResize === "function"
  ) {
    screenManager.activeScreen.handleResize();
  } else if (screenManager && screenManager.activeScreen) {
    screenManager.activeScreen.draw();
  }
}

/**
 * Initializes the mute button functionality.
 */
function initializeMuteButton() {
  const muteButton = document.getElementById("muteButton");
  if (muteButton) {
    setupMuteState();
    muteButton.addEventListener("click", toggleMute);
  }
}

/**
 * Sets up the initial mute state based on local storage.
 */
function setupMuteState() {
  const isMusicOff = localStorage.getItem("musicOn") === "false";
  AudioHub.isMuted = isMusicOff;
  updateMuteButtonIcon(AudioHub.isMuted);
}

/**
 * Toggles the mute state and updates local storage and the button icon.
 */
function toggleMute() {
  AudioHub.isMuted = !AudioHub.isMuted;
  AudioHub.muteAll(AudioHub.isMuted);
  localStorage.setItem("musicOn", !AudioHub.isMuted);
  updateMuteButtonIcon(AudioHub.isMuted);
}

/**
 * Updates the mute button icon based on the current mute state.
 * @param {boolean} isMuted - The current mute state.
 */
function updateMuteButtonIcon(isMuted) {
  const muteIcon = document.getElementById("muteIcon");
  if (muteIcon) {
    muteIcon.src = isMuted
      ? "assets/img/ui/volume-mute.png"
      : "assets/img/ui/volume.png";
  }
}

/**
 * Clears all active intervals in the window.
 */
function clearAllIntervals() {
  for (let i = 1; i < 9999; i++) window.clearInterval(i);
}

/**
 * Handles the game over state, stopping all sounds and showing the game over screen.
 */
function gameOver() {
  AudioHub.stopAllSounds();
  gameIsOver = true;
  showScreen("gameOver");
  clearAllIntervals();
}

/**
 * Handles the game won state, stopping all sounds and showing the game won screen.
 */
function gameWon() {
  AudioHub.stopAllSounds();
  gameIsOver = true;
  showScreen("gameWon");
  clearAllIntervals();
}

/**
 * Starts the game by resetting game state, clearing intervals, building the level,
 * creating the world, and running it.
 */
function startGame() {
  gameIsOver = false;
  clearAllIntervals();
  level1 = buildLevel1();
  world = new World(canvas, keyboard, level1);
  world.run();
}

/**
 * Handles keydown events and updates the keyboard state.
 * @param {KeyboardEvent} event - The keydown event.
 */
function keyboardKeyDown(event) {
  if (event.key === "ArrowLeft") keyboard.LEFT = true;
  else if (event.key === "ArrowRight") keyboard.RIGHT = true;
  else if (event.key === "ArrowUp") keyboard.UP = true;
  else if (event.key === "ArrowDown") keyboard.DOWN = true;
  else if (event.key === " ") keyboard.SPACE = true;
  else if (event.key === "d") keyboard.D = true;
}

/**
 * Handles keyup events and updates the keyboard state.
 * @param {KeyboardEvent} event - The keyup event.
 */
function keyboardKeyUp(event) {
  if (event.key === "ArrowLeft") keyboard.LEFT = false;
  else if (event.key === "ArrowRight") keyboard.RIGHT = false;
  else if (event.key === "ArrowUp") keyboard.UP = false;
  else if (event.key === "ArrowDown") keyboard.DOWN = false;
  else if (event.key === " ") keyboard.SPACE = false;
  else if (event.key === "d") keyboard.D = false;
}

/**
 * Binds touch events to virtual buttons.
 */
function bindTouchEvents() {
  bindLeftButtonEvents();
  bindRightButtonEvents();
  bindJumpButtonEvents();
  bindThrowButtonEvents();
}

/**
 * Binds touch events for the left movement button.
 */
function bindLeftButtonEvents() {
  const btnLeft = document.getElementById("btnLeft");
  if (btnLeft) {
    addTouchListener(btnLeft, "touchstart", () => (keyboard.LEFT = true));
    addTouchListener(btnLeft, "touchend", () => (keyboard.LEFT = false));
    addTouchListener(btnLeft, "touchcancel", () => (keyboard.LEFT = false));
  }
}

/**
 * Binds touch events for the right movement button.
 */
function bindRightButtonEvents() {
  const btnRight = document.getElementById("btnRight");
  if (btnRight) {
    addTouchListener(btnRight, "touchstart", () => (keyboard.RIGHT = true));
    addTouchListener(btnRight, "touchend", () => (keyboard.RIGHT = false));
    addTouchListener(btnRight, "touchcancel", () => (keyboard.RIGHT = false));
  }
}

/**
 * Binds touch events for the jump button.
 */
function bindJumpButtonEvents() {
  const btnJump = document.getElementById("btnJump");
  if (btnJump) {
    addTouchListener(btnJump, "touchstart", () => (keyboard.SPACE = true));
    addTouchListener(btnJump, "touchend", () => (keyboard.SPACE = false));
    addTouchListener(btnJump, "touchcancel", () => (keyboard.SPACE = false));
  }
}

/**
 * Binds touch events for the throw button.
 */
function bindThrowButtonEvents() {
  const btnThrow = document.getElementById("btnThrow");
  if (btnThrow) {
    addTouchListener(btnThrow, "touchstart", () => (keyboard.D = true));
    addTouchListener(btnThrow, "touchend", () => (keyboard.D = false));
    addTouchListener(btnThrow, "touchcancel", () => (keyboard.D = false));
  }
}

/**
 * Adds a touch event listener to an element with preventDefault.
 * @param {HTMLElement} element - The element to add the listener to.
 * @param {string} eventType - The type of the touch event.
 * @param {Function} callback - The function to execute on the event.
 */
function addTouchListener(element, eventType, callback) {
  element.addEventListener(eventType, (event) => {
    event.preventDefault();
    callback();
  });
}

/**
 * Shows a specific screen based on the provided screen name.
 * @param {string} screenName - The name of the screen to show.
 */
function showScreen(screenName) {
  if (screenManager) {
  }
  switch (screenName) {
    case "intro":
      screenManager.showIntroScreen();
      break;
    case "start":
      screenManager.showStartScreen();
      break;
    case "controls":
      screenManager.showControlsScreen();
      break;
    case "gameOver":
      screenManager.showGameOverScreen();
      break;
    case "gameWon":
      screenManager.showWinScreen();
      break;
    default:
      console.warn(`Screen "${screenName}" is not defined.`);
  }
}

// Initialize the game when the window is loaded.
window.addEventListener("load", init);
