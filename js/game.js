import { World } from "../models/world.class.js";

const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

let world;

function update() {
  if (world && world.player && typeof world.player.update === "function") {
    world.player.update(); // Rufe die Update-Logik des Spielers auf
    // Hier könnten auch Updates für andere Spielobjekte stehen
  }
}

function draw() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  if (world && typeof world.draw === "function") {
    world.draw(c); // Zeichnet alle Objekte in der Welt (einschließlich des Spielers über seine draw-Methode)
  }
}

function gameLoop() {
  draw();
  update();
  requestAnimationFrame(gameLoop);
}

function init() {
  if (!canvas || !c) {
    console.error("Canvas oder Context konnte nicht gefunden werden!");
    return;
  }

  world = new World(); // Erstelle die Welt-Instanz

  console.log("My character is", world.player);

  // Starte die Animation und den Game Loop
  if (world.player && typeof world.player.animate === "function") {
    world.player.animate(c); // Starte die Animation mit dem Kontext
  }
  gameLoop();
}

init();
