import { GameObject } from "./game-object.class.js";

export class MainCharacter extends GameObject {
  constructor(position, img, width, height, velocity, gravity) {
    super(position, img, width, height, velocity, gravity); // Ruft den Konstruktor der GameObject-Klasse auf
    this.color = "red";
  }

  draw(context) {
    super.draw(context); // Ruft die draw-Methode der Elternklasse auf (zeichnet das blaue Rechteck)
    context.fillStyle = this.color; // Setzt die spezifische Farbe des MainCharacters
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.position.y += this.velocity.y;
    this.velocity.y += this.gravity;

    // Bodenkollisionslogik (ähnlich wie in GameObject)
    if (this.position.y + this.height >= canvas.height) {
      this.position.y = canvas.height - this.height;
      this.velocity.y = 0;
    }
  }

  // Wenn keine spezifische Animationslogik für MainCharacter benötigt wird,
  // kannst du diese Methode entfernen und die geerbte animate-Methode verwenden.
  // animate(context) {
  //   super.animate(context);
  //   // Spezifische Animationslogik für MainCharacter, falls vorhanden
  // }
}
