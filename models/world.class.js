import { MainCharacter } from "./main-character.class.js";

export class World {
  constructor() {
    this.player = new MainCharacter(
      { x: 200, y: 200 }, // position als Objekt mit x und y
      null,
      50,
      50,
      { x: 0, y: 0.1 }, // velocity als Objekt mit x und y (Beispiel: bewegt sich langsam nach unten)
      0.1,
    );
  }

  draw(context) {
    this.player.draw(context);
  }
}
