let canvas;
let world;
let keyboard = new Keyboard();
let screenManager;
let level1;
let musicPlaying = false;
const muteButton = document.getElementById("muteButton");
const muteIcon = document.getElementById("muteIcon");

function init() {
  canvas = document.getElementById("canvas");
  screenManager = new ScreenManager(canvas, startGame);
  window.addEventListener("keydown", keyboardKeyDown);
  window.addEventListener("keyup", keyboardKeyUp);
  window.onload = () => {
    initializeMuteButton();
    if (!musicPlaying) {
      AudioHub.playLoopingSound(AudioHub.STARTSCREEN_MUSIC);
      musicPlaying = true;
    }
  };
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
  console.log("gameOver wird aufgerufen");
  showScreen("gameOver");
  clearAllIntervals();
}

function startGame() {
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

// Neue Funktion zum Anzeigen von Bildschirmen
function showScreen(screenName) {
  if (!screenManager) {
    console.error("ScreenManager is not initialized.");
    return;
  } else if (screenManager) {
    console.log("screenManager da");
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
    default:
      console.warn(`Screen "${screenName}" is not defined.`);
  }
}

window.addEventListener("load", init);
