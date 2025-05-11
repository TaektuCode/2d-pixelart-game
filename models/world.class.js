class World {
  character = new MainCharacter();
  level;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  collectableStatusBar = new StatusBarCollectables();
  statusCoins = new StatusCoins();
  throwableObjects = [];
  isThrowing = false;
  endbossStatusBar = null;

  constructor(canvas, keyboard, level) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = level;
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
      this.checkCollisionWithEndboss();
      this.checkThrowObjects();
      this.checkCollectables();
      this.checkCollectableStones();
      this.checkThrowableObjectCollisionsWithEnemies();
      this.checkEndbossActivation();
      this.checkThrowableObjectCollisionWithEndboss();
    }, 100);
    AudioHub.playLoopingSound(AudioHub.GAME_MUSIC);
  }

  checkThrowObjects() {
    if (this.keyboard.D && !this.isThrowing && this.character.stones > 0) {
      this.isThrowing = true;

      let stone = new ThrowableObject(
        this.character.x + this.character.width / 2,
        this.character.y + this.character.height / 2,
        this.character.otherDirection,
      );
      this.throwableObjects.push(stone);
      stone.throw();
      this.character.stones--;
      console.log(
        "Stein geworfen. Verbleibende Anzahl:",
        this.character.stones,
      );
      this.collectableStatusBar.setCollectableCount(this.character.stones);
      setTimeout(() => {
        this.isThrowing = false;
      }, 500);
    } else if (!this.keyboard.D) {
      this.isThrowing = false;
    }
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy, index) => {
      if (
        this.character.isColliding(enemy) &&
        !this.character.isDeadCharacter
      ) {
        if (
          this.character.isJumping &&
          this.character.speedY <= 0 &&
          this.character.y + this.character.height <= enemy.y + 100
        ) {
          enemy.hit();
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

  checkEndbossActivation() {
    if (this.level.endboss && this.level.endboss.length > 0) {
      const endboss = this.level.endboss[0];
      const activationXPosition = 2000;

      if (
        this.character.x > activationXPosition &&
        !endboss.isMovingLeft &&
        !endboss.isDead &&
        !endboss.hasAttacked
      ) {
        AudioHub.stopOneSound(AudioHub.GAME_MUSIC);
        AudioHub.playOneSound(AudioHub.ENDBOSS_ACTIVATION); // Spiele den Aktivierungs-Sound ab
        endboss.hasAttacked = true;
        AudioHub.playLoopingSound(AudioHub.ENDBOSS_FIGHT);
        endboss.playAttackAnimation(() => {
          endboss.isMovingLeft = true;
          endboss.startMovingLeft();
          console.log("Endboss aktiviert und greift an!");
          this.createAndAddEndbossStatusBar(); // Rufe die neue Methode auf
        });
      }
    }
  }

  createAndAddEndbossStatusBar() {
    this.endbossStatusBar = new StatusBarEndboss(this.canvas.width); // Jetzt mit Canvas-Breite
    this.addToMap(this.endbossStatusBar);
  }

  checkCollisionWithEndboss() {
    if (this.level.endboss && this.level.endboss.length > 0) {
      const endboss = this.level.endboss[0];
      if (this.character.isColliding(endboss)) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.hp);
      }
    }
  }

  checkThrowableObjectCollisionsWithEnemies() {
    this.throwableObjects.forEach((throwableObject, index) => {
      if (!throwableObject.isRemoved) {
        // Nur prüfen, wenn der Stein nicht entfernt wurde
        this.level.enemies.forEach((enemy, enemyIndex) => {
          if (throwableObject.isColliding(enemy)) {
            if (enemy instanceof Enemy1) {
              AudioHub.playOneSound(AudioHub.ENEMY1DEAD);
            } else if (enemy instanceof Enemy2) {
              AudioHub.playOneSound(AudioHub.ENEMY2DEAD);
            }
            this.level.enemies.splice(enemyIndex, 1);
            throwableObject.remove(); // Entferne den Stein nach der Kollision
          }
        });
      }
      if (throwableObject.isRemoved) {
        this.throwableObjects.splice(index, 1);
      }
    });
    // Filter entfernt die entfernten Objekte aus dem Array (sauberere Lösung)
    this.throwableObjects = this.throwableObjects.filter(
      (obj) => !obj.isRemoved,
    );
  }

  checkThrowableObjectCollisionWithEndboss() {
    this.throwableObjects.forEach((throwableObject) => {
      if (!throwableObject.isRemoved) {
        if (this.level.endboss && this.level.endboss.length > 0) {
          const endboss = this.level.endboss[0];
          if (throwableObject.isColliding(endboss)) {
            endboss.hit(30);
            console.log("Endboss getroffen! Neue HP:", endboss.hp);
            throwableObject.remove(); // Entferne den Stein nach der Kollision
            if (this.endbossStatusBar) {
              this.endbossStatusBar.setPercentage(endboss.hp);
            }
            if (endboss.hp <= 0 && !endboss.isDead) {
              endboss.die();
            }
          }
        }
      }
    });
    this.throwableObjects = this.throwableObjects.filter(
      (obj) => !obj.isRemoved,
    );
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
        this.character.stones++; // Erhöhe die Anzahl der Steine des Charakters
        AudioHub.playOneSound(AudioHub.COLLECTSTONE);
        console.log(
          "Stein eingesammelt. Aktuelle Anzahl:",
          this.character.stones,
        ); // Optional zur Überprüfung
      }
    });
  }

  draw() {
    if (gameIsOver) {
      return;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    if (this.level.endboss && this.level.endboss.length > 0) {
      this.addToMap(this.level.endboss[0]);

      if (this.endbossStatusBar) {
        // Berechne die x-Position für die obere rechte Ecke relativ zur Kamera
        this.endbossStatusBar.x =
          this.canvas.width - this.endbossStatusBar.width - 10 - this.camera_x; // 10 Pixel Abstand

        this.addToMap(this.endbossStatusBar);
      }
    }
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.collectables);
    this.addObjectsToMap(this.level.collectableStone);
    this.addObjectsToMap(this.throwableObjects.filter((obj) => !obj.isRemoved));

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

  clearAllIntervals() {
    for (let i = 1; i < 9999; i++) window.clearInterval(i);
  }

  addToMap(go) {
    if (go instanceof DrawableObject) {
      go.draw(this.ctx);
      if (
        go instanceof MainCharacter ||
        go instanceof Enemy1 ||
        go instanceof Enemy2 ||
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
