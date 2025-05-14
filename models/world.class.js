/**
 * Represents the game world and handles core game loop and interactions.
 */
class World {
  character = new MainCharacter();
  statusBar = new StatusBar();
  collectableStatusBar = new StatusBarCollectables();
  statusCoins = new StatusCoins();
  throwableObjects = [];
  isThrowing = false;
  endbossStatusBar = null;
  endbossActivated = false;

  /**
   * Creates the game world.
   * @param {HTMLCanvasElement} canvas - The canvas element to draw the game on.
   * @param {object} keyboard - The keyboard input handler.
   * @param {object} level - The level data containing enemies, objects, etc.
   */
  constructor(canvas, keyboard, level) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = level;
    this.draw();
    this.setWorld();
    this.run();
  }

  /** Links the world instance to the character. */
  setWorld() {
    this.character.world = this;
  }

  /** Starts the game loop and background music. */
  run() {
    this.gameInterval = setInterval(() => this.gameLoop(), 100);
    AudioHub.playLoopingSound(AudioHub.GAME_MUSIC);
  }

  /** Main game loop: checks collisions and events. */
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

  /** Checks if player can throw and initiates throw if allowed. */
  checkThrowObjects() {
    if (this.canThrowStone()) {
      this.throwStone();
    } else if (!this.keyboard.D) {
      this.isThrowing = false;
    }
  }

  /** @returns {boolean} Whether the player is allowed to throw a stone. */
  canThrowStone() {
    return this.keyboard.D && !this.isThrowing && this.character.stones > 0;
  }

  /** Creates and throws a stone from the character’s position. */
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

  /** Checks collision between character and enemies. */
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

  /**
   * Determines if the character is jumping on the enemy.
   * @param {object} enemy - The enemy object to check.
   * @returns {boolean}
   */
  isJumpingOnEnemy(enemy) {
    return (
      this.character.isJumping &&
      this.character.speedY <= 0 &&
      this.character.y + this.character.height <= enemy.y + 100
    );
  }

  /**
   * Handles logic when character jumps on an enemy.
   * @param {object} enemy - The enemy object hit.
   * @param {number} index - Index of the enemy in the array.
   */
  processJumpOnEnemy(enemy, index) {
    enemy.hit();
    this.level.enemies.splice(index, 1);
    this.character.speedY = -5;
    this.character.isJumping = false;
  }

  /** Handles logic when character is hit by an enemy. */
  processCharacterHit() {
    this.character.hit();
    this.statusBar.setPercentage(this.character.hp);
  }

  /** Checks if endboss should be activated. */
  checkEndbossActivation() {
    if (this.isEndbossPresentAndReady()) {
      this.activateEndbossSequence();
    }
  }

  /** @returns {boolean} Whether the endboss is in a state to be activated. */
  isEndbossPresentAndReady() {
    const endboss = this.level.endboss[0];
    return (
      this.character.x > 2000 &&
      !endboss.isMovingLeft &&
      !endboss.isDead &&
      !endboss.hasAttacked
    );
  }

  /** Triggers the endboss sequence with sounds and animation. */
  activateEndbossSequence() {
    const endboss = this.level.endboss[0];
    AudioHub.stopOneSound(AudioHub.GAME_MUSIC);
    AudioHub.playOneSound(AudioHub.ENDBOSS_ACTIVATION);
    endboss.hasAttacked = true;
    AudioHub.playLoopingSound(AudioHub.ENDBOSS_FIGHT);
    endboss.playAttackAnimation(() => this.triggerEndbossMovement(endboss));
  }

  /**
   * Starts the endboss movement and initializes its status bar.
   * @param {object} endboss - The endboss object.
   */
  triggerEndbossMovement(endboss) {
    endboss.isMovingLeft = true;
    endboss.startMovingLeft();
    this.endbossStatusBar = new StatusBarEndboss(this.canvas.width);
    this.addToMap(this.endbossStatusBar);
  }

  /** Checks for collisions between the character and the endboss. */
  checkCollisionWithEndboss() {
    const endboss = this.level.endboss?.[0];
    if (endboss && this.character.isColliding(endboss)) {
      this.character.hit();
      this.statusBar.setPercentage(this.character.hp);
    }
  }

  /** Checks collisions between throwable objects and enemies. */
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

  /**
   * Plays the appropriate sound when an enemy dies.
   * @param {object} enemy - The enemy that died.
   */
  playEnemyDeathSound(enemy) {
    const sound =
      enemy instanceof Enemy1 ? AudioHub.ENEMY1DEAD : AudioHub.ENEMY2DEAD;
    AudioHub.playOneSound(sound);
  }

  /**
   * Removes an enemy from the level.
   * @param {number} enemyIndex - Index of the enemy to remove.
   */
  removeEnemy(enemyIndex) {
    this.level.enemies.splice(enemyIndex, 1);
  }

  /** Handles hits between throwable objects and the endboss. */
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

  /** Checks for collisions with coin collectables. */
  checkCollectables() {
    this.level.collectables.forEach((collectable, index) => {
      if (this.character.isColliding(collectable)) {
        this.level.collectables.splice(index, 1);
        this.statusCoins.increaseCoinCount();
      }
    });
  }

  /** Checks for collisions with stone collectables. */
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

  /** Draws all game elements to the canvas. */
  draw() {
    if (gameIsOver) return;
    this.clearCanvasAndSetCamera();
    this.drawBackgroundElements();
    this.drawCharacterAndEndboss();
    this.drawInteractiveElements();
    this.resetCameraAndDrawUI();
    this.requestNextFrame();
  }

  /** Clears the canvas and applies camera translation. */
  clearCanvasAndSetCamera() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
  }

  /** Draws background objects like sky and clouds. */
  drawBackgroundElements() {
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
  }

  /** Draws character and endboss if applicable. */
  drawCharacterAndEndboss() {
    this.addToMap(this.character);
    this.handleEndbossActivation();
    this.renderEndbossIfActivated();
  }

  /** Activates endboss when player reaches trigger point. */
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

  /** Renders endboss and its status bar if active. */
  renderEndbossIfActivated() {
    if (this.endbossActivated) {
      const endboss = this.level.endboss[0];
      this.addToMap(endboss);
      this.updateEndbossStatusBarPosition();
      this.addToMap(this.endbossStatusBar);
    }
  }

  /** Initializes the endboss health bar. */
  initializeEndbossStatusBar() {
    if (!this.endbossStatusBar) {
      this.endbossStatusBar = new StatusBarEndboss(this.canvas.width);
    }
  }

  /** Updates the position of the endboss status bar. */
  updateEndbossStatusBarPosition() {
    this.endbossStatusBar.x =
      this.canvas.width - this.endbossStatusBar.width - 10 - this.camera_x;
  }

  /** Draws interactive elements like enemies, items, and throwable objects. */
  drawInteractiveElements() {
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.collectables);
    this.addObjectsToMap(this.level.collectableStone);
    this.addObjectsToMap(this.getActiveThrowableObjects());
  }

  /** @returns {Array} Filtered list of active throwable objects. */
  getActiveThrowableObjects() {
    return this.throwableObjects.filter((obj) => !obj.isRemoved);
  }

  /** Resets the camera and draws UI elements. */
  resetCameraAndDrawUI() {
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.addToMap(this.collectableStatusBar);
    this.addToMap(this.statusCoins);
  }

  /** Requests the next animation frame. */
  requestNextFrame() {
    requestAnimationFrame(() => this.draw());
  }

  /**
   * Adds an array of objects to the map.
   * @param {Array} objects - Array of drawable objects.
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => this.addToMap(o));
  }

  /**
   * Draws an individual game object if drawable.
   * @param {object} go - A game object with a draw method.
   */
  addToMap(go) {
    if (go instanceof DrawableObject) go.draw(this.ctx);
  }

  /** Clears all set intervals in the window scope. */
  clearAllIntervals() {
    for (let i = 1; i < 9999; i++) window.clearInterval(i);
  }
}
