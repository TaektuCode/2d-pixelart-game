import { GameObject } from "../models/game-object.class.js";
import { MainCharacter } from "../models/main-character.class.js";
import { World } from "../models/world.class.js";

const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

let world = new World();

function init() {
  canvas;
  c;

  console.log("My character is", world.player);
}

init();
