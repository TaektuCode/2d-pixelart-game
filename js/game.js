let canvas;
let world;
let keyboard = new Keyboard();
let screenManager;
let level1;
let musicPlaying = false;

function init() {
  localStorage.setItem("musicOn", "true");
  canvas = document.getElementById("canvas");
  screenManager = new ScreenManager(canvas, startGame);
  if (!musicPlaying) {
    AudioHub.playLoopingSound(AudioHub.STARTSCREEN_MUSIC);
    musicPlaying = true;
  }
  window.addEventListener("keydown", keyboardKeyDown);
  window.addEventListener("keyup", keyboardKeyUp);
}

function clearAllIntervals() {
  for (let i = 1; i < 9999; i++) window.clearInterval(i);
}

function startGame() {
  clearAllIntervals();
  level1 = buildLevel1(); // Rufe deine Funktion auf, um das Level zu erstellen
  world = new World(canvas, keyboard, level1); // Übergib das Level an die World-Klasse
  world.startGameLoop(); // Starte die Spiellogik
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

window.addEventListener("load", init);
