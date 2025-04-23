let canvas;
let ctx;
let character = new GameObject();

function init() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  console.log("My char is", character);
}
