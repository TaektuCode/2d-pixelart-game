class World {
  character = new MainCharacter();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  throwableObjects = [new ThrowableObject()];
  isThrowing = false;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
    }, 200);
  }

  checkThrowObjects() {
    if (this.keyboard.D && !this.isThrowing) {
      this.isThrowing = true; // Setze die Flagge, um weitere Würfe zu blockieren

      let stone = new ThrowableObject(
        this.character.x + this.character.width / 2,
        this.character.y + this.character.height / 2,
      );
      this.throwableObjects.push(stone);
      stone.throw();

      // Setze die Flagge nach einer kurzen Verzögerung zurück, um den nächsten Wurf zu ermöglichen
      setTimeout(() => {
        this.isThrowing = false;
      }, 5000); // 5000 Millisekunden Verzögerung (anpassbar)
    } else if (!this.keyboard.D) {
      this.isThrowing = false;
    }
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.hp); // Aktualisiere die Statusbar
        console.log("Energy is", this.character.hp);
      }
    });
  }

  draw() {
    // clear Canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Anwenden der Kameratransformation
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);

    // 2. Zurücksetzen der Kameratransformation
    this.ctx.translate(-this.camera_x, 0);

    // 3. Zeichnen der Statusbar nach dem Zurücksetzen der Transformation
    this.addToMap(this.statusBar);

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
    if (go instanceof DrawableObject) {
      go.draw(this.ctx); // Rufe die draw-Methode des DrawableObject auf
      if (
        go instanceof MainCharacter ||
        go instanceof Enemy1 ||
        go instanceof Endboss
      ) {
        go.drawCollisionBox(this.ctx); // Zeichne die Kollisionsbox separat
      }
    }
  }
}
