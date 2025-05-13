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
  const muteIcon = document.getElementById("muteIcon");
  let isMuted = localStorage.getItem("musicOn") === "false";
  AudioHub.isMuted = isMuted;
  updateMuteButtonIcon();

  muteButton.addEventListener("click", () => {
    isMuted = !isMuted;
    AudioHub.muteAll(isMuted);
    localStorage.setItem("musicOn", !isMuted);
    updateMuteButtonIcon();
  });

  function updateMuteButtonIcon() {
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
  const btnLeft = document.getElementById("btnLeft");
  const btnRight = document.getElementById("btnRight");
  const btnJump = document.getElementById("btnJump");
  const btnThrow = document.getElementById("btnThrow");

  if (btnLeft) {
    btnLeft.addEventListener("touchstart", (event) => {
      event.preventDefault();
      keyboard.LEFT = true;
    });
    btnLeft.addEventListener("touchend", (event) => {
      event.preventDefault();
      keyboard.LEFT = false;
    });
    btnLeft.addEventListener("touchcancel", (event) => {
      event.preventDefault();
      keyboard.LEFT = false;
    });
  }

  if (btnRight) {
    btnRight.addEventListener("touchstart", (event) => {
      event.preventDefault();
      keyboard.RIGHT = true;
    });
    btnRight.addEventListener("touchend", (event) => {
      event.preventDefault();
      keyboard.RIGHT = false;
    });
    btnRight.addEventListener("touchcancel", (event) => {
      event.preventDefault();
      keyboard.RIGHT = false;
    });
  }

  if (btnJump) {
    btnJump.addEventListener("touchstart", (event) => {
      event.preventDefault();
      keyboard.SPACE = true;
    });
    btnJump.addEventListener("touchend", (event) => {
      event.preventDefault();
      keyboard.SPACE = false;
    });
    btnJump.addEventListener("touchcancel", (event) => {
      event.preventDefault();
      keyboard.SPACE = false;
    });
  }

  if (btnThrow) {
    btnThrow.addEventListener("touchstart", (event) => {
      event.preventDefault();
      keyboard.D = true;
    });
    btnThrow.addEventListener("touchend", (event) => {
      event.preventDefault();
      keyboard.D = false;
    });
    btnThrow.addEventListener("touchcancel", (event) => {
      event.preventDefault();
      keyboard.D = false;
    });
  }
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
