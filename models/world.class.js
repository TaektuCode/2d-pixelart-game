class World {
  character = new MainCharacter();
  enemies = [new Enemy1(), new Enemy1(), new Enemy1()];
  canvas;
  ctx;

  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.drawImage(
      this.character.img,
      this.character.x,
      this.character.y,
      this.character.height,
      this.character.width,
    );

    this.enemies.forEach((enemy) => {
      this.ctx.save(); // Speichere den aktuellen Canvas-Zustand

      // Setze den Drehpunkt für die Spiegelung (Mittelpunkt der horizontalen Ausdehnung)
      const centerX = enemy.x + enemy.width / 2;
      this.ctx.translate(centerX, 0); // Verschiebe den Ursprung zum Mittelpunkt
      this.ctx.scale(-1, 1); // Spiegele horizontal

      // Zeichne das Bild an der angepassten Position
      this.ctx.drawImage(
        enemy.img,
        -enemy.width / 2,
        enemy.y,
        enemy.height,
        enemy.width,
      );

      this.ctx.restore();
    });

    // draw() is called always
    self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }
}
