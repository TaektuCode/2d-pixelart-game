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

function resizeCanvas() {
  if (gameBox && canvas) {
    canvas.width = gameBox.offsetWidth;
    canvas.height = gameBox.offsetHeight;

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
}

function initializeMuteButton() {
  const muteButton = document.getElementById("muteButton");
  if (muteButton) {
    setupMuteState();
    muteButton.addEventListener("click", toggleMute);
  }
}

function setupMuteState() {
  const isMusicOff = localStorage.getItem("musicOn") === "false";
  AudioHub.isMuted = isMusicOff;
  updateMuteButtonIcon(AudioHub.isMuted);
}

function toggleMute() {
  AudioHub.isMuted = !AudioHub.isMuted;
  AudioHub.muteAll(AudioHub.isMuted);
  localStorage.setItem("musicOn", !AudioHub.isMuted);
  updateMuteButtonIcon(AudioHub.isMuted);
}

function updateMuteButtonIcon(isMuted) {
  const muteIcon = document.getElementById("muteIcon");
  if (muteIcon) {
    muteIcon.src = isMuted
      ? "assets/img/ui/volume-mute.png"
      : "assets/img/ui/volume.png";
  }
}

function clearAllIntervals() {
  for (let i = 1; i < 9999; i++) window.clearInterval(i);
}

function gameOver() {
  AudioHub.stopAllSounds();
  gameIsOver = true;
  showScreen("gameOver");
  clearAllIntervals();
}

function gameWon() {
  AudioHub.stopAllSounds();
  gameIsOver = true;
  showScreen("gameWon");
  clearAllIntervals();
}

function startGame() {
  gameIsOver = false;
  clearAllIntervals();
  level1 = buildLevel1();
  world = new World(canvas, keyboard, level1);
  world.run();
}

function keyboardKeyDown(event) {
  if (event.key === "ArrowLeft") keyboard.LEFT = true;
  else if (event.key === "ArrowRight") keyboard.RIGHT = true;
  else if (event.key === "ArrowUp") keyboard.UP = true;
  else if (event.key === "ArrowDown") keyboard.DOWN = true;
  else if (event.key === " ") keyboard.SPACE = true;
  else if (event.key === "d") keyboard.D = true;
}

function keyboardKeyUp(event) {
  if (event.key === "ArrowLeft") keyboard.LEFT = false;
  else if (event.key === "ArrowRight") keyboard.RIGHT = false;
  else if (event.key === "ArrowUp") keyboard.UP = false;
  else if (event.key === "ArrowDown") keyboard.DOWN = false;
  else if (event.key === " ") keyboard.SPACE = false;
  else if (event.key === "d") keyboard.D = false;
}

function bindTouchEvents() {
  bindLeftButtonEvents();
  bindRightButtonEvents();
  bindJumpButtonEvents();
  bindThrowButtonEvents();
}

function bindLeftButtonEvents() {
  const btnLeft = document.getElementById("btnLeft");
  if (btnLeft) {
    addTouchListener(btnLeft, "touchstart", () => (keyboard.LEFT = true));
    addTouchListener(btnLeft, "touchend", () => (keyboard.LEFT = false));
    addTouchListener(btnLeft, "touchcancel", () => (keyboard.LEFT = false));
  }
}

function bindRightButtonEvents() {
  const btnRight = document.getElementById("btnRight");
  if (btnRight) {
    addTouchListener(btnRight, "touchstart", () => (keyboard.RIGHT = true));
    addTouchListener(btnRight, "touchend", () => (keyboard.RIGHT = false));
    addTouchListener(btnRight, "touchcancel", () => (keyboard.RIGHT = false));
  }
}

function bindJumpButtonEvents() {
  const btnJump = document.getElementById("btnJump");
  if (btnJump) {
    addTouchListener(btnJump, "touchstart", () => (keyboard.SPACE = true));
    addTouchListener(btnJump, "touchend", () => (keyboard.SPACE = false));
    addTouchListener(btnJump, "touchcancel", () => (keyboard.SPACE = false));
  }
}

function bindThrowButtonEvents() {
  const btnThrow = document.getElementById("btnThrow");
  if (btnThrow) {
    addTouchListener(btnThrow, "touchstart", () => (keyboard.D = true));
    addTouchListener(btnThrow, "touchend", () => (keyboard.D = false));
    addTouchListener(btnThrow, "touchcancel", () => (keyboard.D = false));
  }
}

function addTouchListener(element, eventType, callback) {
  element.addEventListener(eventType, (event) => {
    event.preventDefault();
    callback();
  });
}

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

window.addEventListener("load", init);
