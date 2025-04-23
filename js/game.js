let canvas;
let world;

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas);

  console.log("My char is", world.character);
  console.log("My Enemis", world.enemies);
}
