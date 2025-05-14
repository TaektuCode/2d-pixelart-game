class World {
  character = new MainCharacter();
  statusBar = new StatusBar();
  collectableStatusBar = new StatusBarCollectables();
  statusCoins = new StatusCoins();
  throwableObjects = [];
  isThrowing = false;
  endbossStatusBar = null;
  endbossActivated = false;

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
    this.gameInterval = setInterval(() => this.gameLoop(), 100); // Fixed interval reference
    AudioHub.playLoopingSound(AudioHub.GAME_MUSIC);
  }

  gameLoop() {
    this.checkCollisions();
    this.checkCollisionWithEndboss();
    this.checkThrowObjects();
    this.checkCollectables();
    this.checkCollectableStones();
    this.checkThrowableObjectCollisionsWithEnemies();
    this.checkEndbossActivation();
    this.checkThrowableObjectCollisionWithEndboss();
  }

  checkThrowObjects() {
    if (this.canThrowStone()) {
      this.throwStone();
    } else if (!this.keyboard.D) {
      this.isThrowing = false;
    }
  }

  canThrowStone() {
    return this.keyboard.D && !this.isThrowing && this.character.stones > 0;
  }

  throwStone() {
    this.isThrowing = true;
    const stone = new ThrowableObject(
      this.character.x + this.character.width / 2,
      this.character.y + this.character.height / 2,
      this.character.otherDirection,
    );
    this.throwableObjects.push(stone);
    stone.throw();
    this.character.stones--;
    this.collectableStatusBar.setCollectableCount(this.character.stones);
    setTimeout(() => (this.isThrowing = false), 500);
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy, index) => {
      if (
        this.character.isColliding(enemy) &&
        !this.character.isDeadCharacter
      ) {
        this.isJumpingOnEnemy(enemy)
          ? this.processJumpOnEnemy(enemy, index)
          : this.processCharacterHit();
      }
    });
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
    const endboss = this.level.endboss[0];
    return (
      this.character.x > 2000 &&
      !endboss.isMovingLeft &&
      !endboss.isDead &&
      !endboss.hasAttacked
    );
  }

  activateEndbossSequence() {
    const endboss = this.level.endboss[0];
    AudioHub.stopOneSound(AudioHub.GAME_MUSIC);
    AudioHub.playOneSound(AudioHub.ENDBOSS_ACTIVATION);
    endboss.hasAttacked = true;
    AudioHub.playLoopingSound(AudioHub.ENDBOSS_FIGHT);
    endboss.playAttackAnimation(() => this.triggerEndbossMovement(endboss));
  }

  triggerEndbossMovement(endboss) {
    endboss.isMovingLeft = true;
    endboss.startMovingLeft();
    this.endbossStatusBar = new StatusBarEndboss(this.canvas.width);
    this.addToMap(this.endbossStatusBar);
  }

  checkCollisionWithEndboss() {
    const endboss = this.level.endboss?.[0];
    if (endboss && this.character.isColliding(endboss)) {
      this.character.hit();
      this.statusBar.setPercentage(this.character.hp);
    }
  }

  checkThrowableObjectCollisionsWithEnemies() {
    this.throwableObjects.forEach((obj, index) => {
      if (!obj.isRemoved) {
        this.level.enemies.forEach((enemy, enemyIndex) => {
          if (obj.isColliding(enemy)) {
            this.playEnemyDeathSound(enemy);
            this.removeEnemy(enemyIndex);
            obj.remove();
          }
        });
      }
    });
    this.throwableObjects = this.throwableObjects.filter(
      (obj) => !obj.isRemoved,
    );
  }

  playEnemyDeathSound(enemy) {
    const sound =
      enemy instanceof Enemy1 ? AudioHub.ENEMY1DEAD : AudioHub.ENEMY2DEAD;
    AudioHub.playOneSound(sound);
  }

  removeEnemy(enemyIndex) {
    this.level.enemies.splice(enemyIndex, 1);
  }

  checkThrowableObjectCollisionWithEndboss() {
    this.throwableObjects.forEach((throwableObject) => {
      if (throwableObject.isColliding(this.level.endboss[0])) {
        const endboss = this.level.endboss[0];
        endboss.hit(30);
        throwableObject.remove();
        this.endbossStatusBar.setPercentage(endboss.hp);
        if (endboss.hp <= 0 && !endboss.isDead) {
          endboss.die();
        }
      }
    });
    this.throwableObjects = this.throwableObjects.filter(
      (obj) => !obj.isRemoved,
    );
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
    this.handleEndbossActivation();
    this.renderEndbossIfActivated();
  }

  handleEndbossActivation() {
    if (
      this.level.endboss?.length > 0 &&
      this.character.x >= 2100 &&
      !this.endbossActivated
    ) {
      const endboss = this.level.endboss[0];
      this.endbossActivated = true;
      endboss.activate();
      endboss.startMovingLeft();
      this.initializeEndbossStatusBar();
    }
  }

  renderEndbossIfActivated() {
    if (this.endbossActivated) {
      const endboss = this.level.endboss[0];
      this.addToMap(endboss);
      this.updateEndbossStatusBarPosition();
      this.addToMap(this.endbossStatusBar);
    }
  }

  initializeEndbossStatusBar() {
    if (!this.endbossStatusBar) {
      this.endbossStatusBar = new StatusBarEndboss(this.canvas.width);
    }
  }

  updateEndbossStatusBarPosition() {
    this.endbossStatusBar.x =
      this.canvas.width - this.endbossStatusBar.width - 10 - this.camera_x;
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
    requestAnimationFrame(() => this.draw());
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => this.addToMap(o));
  }

  addToMap(go) {
    if (go instanceof DrawableObject) go.draw(this.ctx);
  }

  clearAllIntervals() {
    for (let i = 1; i < 9999; i++) window.clearInterval(i);
  }
}
