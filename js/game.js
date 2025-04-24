let canvas;
let world;
let keyboard = new Keyboard();

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);

  console.log("My char is", world.character);
}

//#region Keyboard Events+
window.addEventListener("keydown", (e) => {
  console.log("Keydown-Event:", e.key); // Füge diese Zeile hinzu
  if (e.key === "ArrowLeft") {
    keyboard.LEFT = true;
  } else if (e.key === "ArrowRight") {
    keyboard.RIGHT = true;
  } else if (e.key === "ArrowUp") {
    keyboard.UP = true;
  } else if (e.key === "ArrowDown") {
    keyboard.DOWN = true;
  } else if (e.key === " ") {
    keyboard.SPACE = true;
  } else if (e.key === "d") {
    keyboard.D = true;
  }
});

window.addEventListener("keyup", (e) => {
  console.log("Keyup-Event:", e.key); // Füge diese Zeile hinzu
  if (e.key === "ArrowLeft") {
    keyboard.LEFT = false;
  } else if (e.key === "ArrowRight") {
    keyboard.RIGHT = false;
  } else if (e.key === "ArrowUp") {
    keyboard.UP = false;
  } else if (e.key === "ArrowDown") {
    keyboard.DOWN = false;
  } else if (e.key === " ") {
    keyboard.SPACE = false;
  } else if (e.key === "d") {
    keyboard.D = false;
  }
});

//#endregion
