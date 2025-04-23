class World {
  character = new MainCharacter();
  enemies = [new Enemy1(), new Enemy1(), new Enemy1()];
  clouds = [new Cloud()];
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
      this.character.width,
      this.character.height,
    );

    this.enemies.forEach((enemy) => {
      this.ctx.save();

      const centerX = enemy.x + enemy.width / 2;
      this.ctx.translate(centerX, 0);
      this.ctx.scale(-1, 1); // Spiegele horizontal

      this.ctx.drawImage(
        enemy.img,
        -enemy.width / 2,
        enemy.y,
        enemy.width,
        enemy.height,
      );

      this.ctx.restore();
    });

    this.clouds.forEach((cloud) => {
      this.ctx.drawImage(
        cloud.img,
        cloud.x,
        cloud.y,
        cloud.width,
        cloud.height,
      );
    });

    // draw() is called always
    self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }
}
