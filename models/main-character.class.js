import { GameObject } from "./game-object.class.js";

export class MainCharacter extends GameObject {
  constructor(x, y, img, width, height, speed) {
    super(x, y, img, width, height, speed); // Ruft den Konstruktor der GameObject-Klasse auf
    this.x = 10;
  }
}
