class World {
  character = new MainCharacter();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  collectableStatusBar = new StatusBarCollectables();
  statusCoins = new StatusCoins();
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
      this.checkCollectables();
      this.checkCollectableStones();
      this.checkThrowableObjectCollisionsWithEnemies();
      this.checkThrowableObjectCollisionWithEndboss();
    }, 100);
  }

  checkThrowObjects() {
    if (this.keyboard.D && !this.isThrowing) {
      this.isThrowing = true;

      let stone = new ThrowableObject(
        this.character.x + this.character.width / 2,
        this.character.y + this.character.height / 2,
      );
      this.throwableObjects.push(stone);
      stone.throw();

      setTimeout(() => {
        this.isThrowing = false;
      }, 5000);
    } else if (!this.keyboard.D) {
      this.isThrowing = false;
    }
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy, index) => {
      if (this.character.isColliding(enemy)) {
        if (
          this.character.isJumping &&
          this.character.speedY <= 0 &&
          this.character.y + this.character.height < enemy.y + 180
        ) {
          this.level.enemies.splice(index, 1);
          this.character.speedY = -5;
          this.character.isJumping = false;
        } else {
          this.character.hit();
          this.statusBar.setPercentage(this.character.hp);
        }
      }
    });
  }

  checkThrowableObjectCollisionsWithEnemies() {
    this.throwableObjects.forEach((throwableObject) => {
      this.level.enemies.forEach((enemy, enemyIndex) => {
        if (throwableObject.isColliding(enemy)) {
          this.level.enemies.splice(enemyIndex, 1);
          this.removeThrowableObject(throwableObject);
        }
      });
    });
  }

  checkThrowableObjectCollisionWithEndboss() {
    this.throwableObjects.forEach((throwableObject) => {
      if (this.level.endboss && this.level.endboss.length > 0) {
        const endboss = this.level.endboss[0]; // Gehe davon aus, dass es nur einen Endboss gibt
        if (throwableObject.isColliding(endboss)) {
          endboss.hit(30);
          console.log("Endboss getroffen! Neue HP:", endboss.hp);
          this.removeThrowableObject(throwableObject);
          if (endboss.hp <= 0) {
            this.level.endboss.splice(0, 1); // Entferne den Endboss aus seinem Array
          }
        }
      }
    });
  }

  removeThrowableObject(throwableObject) {
    const index = this.throwableObjects.indexOf(throwableObject);
    if (index > -1) {
      this.throwableObjects.splice(index, 1);
    }
  }

  checkCollectables() {
    this.level.collectables.forEach((collectable, index) => {
      if (this.character.isColliding(collectable)) {
        this.level.collectables.splice(index, 1);
        this.statusCoins.increaseCoinCount();
      }
    });
  }

  checkCollectableStones() {
    this.level.collectableStone.forEach((collectable, index) => {
      if (this.character.isColliding(collectable)) {
        this.level.collectableStone.splice(index, 1);
        this.collectableStatusBar.setCollectableCount(
          this.collectableStatusBar.collectableCount + 1,
        );
      }
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.endboss);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.collectables);
    this.addObjectsToMap(this.level.collectableStone);
    this.addObjectsToMap(this.throwableObjects);

    this.ctx.translate(-this.camera_x, 0);

    this.addToMap(this.statusBar);
    this.addToMap(this.collectableStatusBar);
    this.addToMap(this.statusCoins);

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
      go.draw(this.ctx);
      if (
        go instanceof MainCharacter ||
        go instanceof Enemy1 ||
        go instanceof Endboss ||
        go instanceof CollectableObjects ||
        go instanceof CollectableStone ||
        go instanceof ThrowableObject
      ) {
        go.drawCollisionBox(this.ctx);
      }
    }
  }
}
