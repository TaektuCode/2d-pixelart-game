class World {
  character = new MainCharacter();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
  }

  setWorld() {
    this.character.world = this;
  }

  draw() {
    // clear Canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);

    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);

    this.ctx.translate(-this.camera_x, 0);

    // Draw() is always running
    self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(go) {
    if (go.otherDirection) {
      this.ctx.save();
      this.ctx.translate(go.x + go.width, go.y); // Verschiebe den Ursprung zum rechten Rand des Objekts
      this.ctx.scale(-1, 1);
      this.ctx.drawImage(go.img, 0, 0, go.width, go.height); // Zeichne relativ zum neuen Ursprung (0, 0)
      // Zeichne das Kollisionsrechteck (gespiegelt)
      this.drawCollisionBox({ x: 0, y: 0, width: go.width, height: go.height });
      this.ctx.restore();
    } else {
      this.ctx.drawImage(go.img, go.x, go.y, go.width, go.height);
      // Zeichne das Kollisionsrechteck (nicht gespiegelt)
      this.drawCollisionBox(go);
    }
  }

  drawCollisionBox(go) {
    this.ctx.strokeStyle = "red";
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(go.x, go.y, go.width, go.height);
  }
}
