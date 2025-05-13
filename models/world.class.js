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
    if (this.canThrowStone()) {
      this.throwStone();
      this.updateThrowingState();
    } else if (!this.keyboard.D) {
      this.isThrowing = false;
    }
  }

  canThrowStone() {
    return this.keyboard.D && !this.isThrowing && this.character.stones > 0;
  }

  throwStone() {
    this.isThrowing = true;
    const stone = this.createThrowableObject();
    this.throwableObjects.push(stone);
    stone.throw();
    this.updateStoneCount();
    this.resetThrowingState();
  }

  createThrowableObject() {
    return new ThrowableObject(
      this.character.x + this.character.width / 2,
      this.character.y + this.character.height / 2,
      this.character.otherDirection,
    );
  }

  updateStoneCount() {
    this.character.stones--;
    this.collectableStatusBar.setCollectableCount(this.character.stones);
  }

  resetThrowingState() {
    setTimeout(() => {
      this.isThrowing = false;
    }, 500);
  }

  updateThrowingState() {
    if (!this.keyboard.D) {
      this.isThrowing = false;
    }
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy, index) => {
      this.handleEnemyCollision(enemy, index);
    });
  }

  handleEnemyCollision(enemy, index) {
    if (this.character.isColliding(enemy) && !this.character.isDeadCharacter) {
      if (this.isJumpingOnEnemy(enemy)) {
        this.processJumpOnEnemy(enemy, index);
      } else {
        this.processCharacterHit();
      }
    }
  }

  isJumpingOnEnemy(enemy) {
    return (
      this.character.isJumping &&
      this.character.speedY <= 0 &&
      this.character.y + this.character.height <= enemy.y + 100
    );
  }

  processJumpOnEnemy(enemy, index) {
    enemy.hit();
    this.level.enemies.splice(index, 1);
    this.character.speedY = -5;
    this.character.isJumping = false;
  }

  processCharacterHit() {
    this.character.hit();
    this.statusBar.setPercentage(this.character.hp);
  }

  checkEndbossActivation() {
    if (this.isEndbossPresentAndReady()) {
      this.activateEndbossSequence();
    }
  }

  isEndbossPresentAndReady() {
    if (this.level.endboss && this.level.endboss.length > 0) {
      const endboss = this.level.endboss[0];
      const activationXPosition = 2000;
      return (
        this.character.x > activationXPosition &&
        !endboss.isMovingLeft &&
        !endboss.isDead &&
        !endboss.hasAttacked
      );
    }
    return false;
  }

  activateEndbossSequence() {
    const endboss = this.level.endboss[0];
    this.stopGameMusicForEndboss();
    this.playEndbossActivationSound();
    endboss.hasAttacked = true;
    this.startEndbossFight(endboss);
  }

  stopGameMusicForEndboss() {
    AudioHub.stopOneSound(AudioHub.GAME_MUSIC);
  }

  playEndbossActivationSound() {
    AudioHub.playOneSound(AudioHub.ENDBOSS_ACTIVATION);
  }

  startEndbossFight(endboss) {
    AudioHub.playLoopingSound(AudioHub.ENDBOSS_FIGHT);
    endboss.playAttackAnimation(() => {
      this.triggerEndbossMovement(endboss);
      this.createAndAddEndbossStatusBar();
    });
  }

  triggerEndbossMovement(endboss) {
    endboss.isMovingLeft = true;
    endboss.startMovingLeft();
  }

  createAndAddEndbossStatusBar() {
    this.endbossStatusBar = new StatusBarEndboss(this.canvas.width);
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
      this.handleThrowableObjectCollision(throwableObject, index);
    });
    this.cleanUpThrowableObjects();
  }

  handleThrowableObjectCollision(throwableObject, throwableIndex) {
    if (!throwableObject.isRemoved) {
      this.level.enemies.forEach((enemy, enemyIndex) => {
        this.processThrowableObjectCollisionWithEnemy(
          throwableObject,
          enemy,
          enemyIndex,
        );
      });
    }
    this.removeMarkedThrowableObject(throwableObject, throwableIndex);
  }

  processThrowableObjectCollisionWithEnemy(throwableObject, enemy, enemyIndex) {
    if (throwableObject.isColliding(enemy)) {
      this.playEnemyDeathSound(enemy);
      this.removeEnemy(enemyIndex);
      throwableObject.remove();
    }
  }

  playEnemyDeathSound(enemy) {
    if (enemy instanceof Enemy1) {
      AudioHub.playOneSound(AudioHub.ENEMY1DEAD);
    } else if (enemy instanceof Enemy2) {
      AudioHub.playOneSound(AudioHub.ENEMY2DEAD);
    }
  }

  removeEnemy(enemyIndex) {
    this.level.enemies.splice(enemyIndex, 1);
  }

  removeMarkedThrowableObject(throwableObject, throwableIndex) {
    if (throwableObject.isRemoved) {
      this.throwableObjects.splice(throwableIndex, 1);
    }
  }

  cleanUpThrowableObjects() {
    this.throwableObjects = this.throwableObjects.filter(
      (obj) => !obj.isRemoved,
    );
  }

  checkThrowableObjectCollisionWithEndboss() {
    this.throwableObjects.forEach((throwableObject) => {
      this.handleThrowableCollisionWithEndboss(throwableObject);
    });
    this.cleanUpThrowableObjects();
  }

  handleThrowableCollisionWithEndboss(throwableObject) {
    if (!throwableObject.isRemoved && this.isEndbossPresent()) {
      const endboss = this.level.endboss[0];
      if (throwableObject.isColliding(endboss)) {
        this.processEndbossHitByThrowable(throwableObject, endboss);
      }
    }
  }

  isEndbossPresent() {
    return this.level.endboss && this.level.endboss.length > 0;
  }

  processEndbossHitByThrowable(throwableObject, endboss) {
    endboss.hit(30);
    throwableObject.remove();
    this.updateEndbossStatusBar(endboss);
    this.checkEndbossDeath(endboss);
  }

  updateEndbossStatusBar(endboss) {
    if (this.endbossStatusBar) {
      this.endbossStatusBar.setPercentage(endboss.hp);
    }
  }

  checkEndbossDeath(endboss) {
    if (endboss.hp <= 0 && !endboss.isDead) {
      endboss.die();
    }
  }

  cleanUpThrowableObjects() {
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
        this.character.stones++;
        AudioHub.playOneSound(AudioHub.COLLECTSTONE);
      }
    });
  }

  draw() {
    if (gameIsOver) return;
    this.clearCanvasAndSetCamera();
    this.drawBackgroundElements();
    this.drawCharacterAndEndboss();
    this.drawInteractiveElements();
    this.resetCameraAndDrawUI();
    this.requestNextFrame();
  }

  clearCanvasAndSetCamera() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
  }

  drawBackgroundElements() {
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
  }

  drawCharacterAndEndboss() {
    this.addToMap(this.character);
    this.drawEndbossWithStatusBar();
  }

  drawEndbossWithStatusBar() {
    if (this.level.endboss && this.level.endboss.length > 0) {
      const endboss = this.level.endboss[0];
      this.addToMap(endboss);
      this.positionAndDrawEndbossStatusBar();
    }
  }

  positionAndDrawEndbossStatusBar() {
    if (this.endbossStatusBar) {
      this.endbossStatusBar.x =
        this.canvas.width - this.endbossStatusBar.width - 10 - this.camera_x;
      this.addToMap(this.endbossStatusBar);
    }
  }

  drawInteractiveElements() {
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.collectables);
    this.addObjectsToMap(this.level.collectableStone);
    this.addObjectsToMap(this.getActiveThrowableObjects());
  }

  getActiveThrowableObjects() {
    return this.throwableObjects.filter((obj) => !obj.isRemoved);
  }

  resetCameraAndDrawUI() {
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.addToMap(this.collectableStatusBar);
    this.addToMap(this.statusCoins);
  }

  requestNextFrame() {
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
