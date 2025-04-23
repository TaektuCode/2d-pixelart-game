class World {
  character = new MainCharacter();
  enemies = [new Enemy1(), new Enemy1(), new Enemy1()];
  clouds = [new Cloud("assets/img/clouds/clouds2.png", 0)];
  backgroundObjects = [
    new BackgroundObject("assets/img/background/sky.png", 0, 0), // path, x,
    new BackgroundObject("assets/img/background/rocks.png", 0, 0),
    new BackgroundObject("assets/img/background/rocks2.png", 0, 0),
    new BackgroundObject("assets/img/background/rocks3.png", 0, 0),
    new BackgroundObject("assets/img/background/ground_tile07.png", 0, 340),
  ];
  canvas;
  ctx;

  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.draw();
  }

  draw() {
    // clear Canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.addObjectsToMap(this.backgroundObjects);
    this.addObjectsToMap(this.clouds);
    // add character
    this.addToMap(this.character);

    //#region enemies flip x-axis
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
    //#endregion

    // draw() is called always
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
    this.ctx.drawImage(go.img, go.x, go.y, go.width, go.height);
  }
}
