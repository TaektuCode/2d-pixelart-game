/**
 * @file Manages the game world: character, level, entities, collisions, rendering, game loop.
 */

/**
 * Manages the game world, including entities, collisions, and rendering.
 */
class World {
  /** @type {MainCharacter} */ character = new MainCharacter();
  /** @type {Level} */ level;
  /** @type {HTMLCanvasElement} */ canvas;
  /** @type {CanvasRenderingContext2D} */ ctx;
  /** @type {Keyboard} */ keyboard;
  /** @type {number} */ camera_x = 0;
  /** @type {StatusBar} */ statusBar = new StatusBar();
  /** @type {StatusBarCollectables} */ collectableStatusBar =
    new StatusBarCollectables();
  /** @type {StatusCoins} */ statusCoins = new StatusCoins();
  /** @type {ThrowableObject[]} */ throwableObjects = [];
  /** @type {boolean} */ isThrowing = false;
  /** @type {StatusBarEndboss|null} */ endbossStatusBar = null;

  /**
   * Initializes the world with canvas, keyboard, and level, then starts the game.
   * @param {HTMLCanvasElement} canvas - The canvas to render on.
   * @param {Keyboard} keyboard - The keyboard input.
   * @param {Level} level - The game level.
   */
  constructor(canvas, keyboard, level) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = level;
    this.draw();
    this.character.world = this;
    this.run();
  }

  /** Sets the character's world reference. */
  setWorld() {
    this.character.world = this;
  }

  /** Starts the game loop and background music. */
  run() {
    setInterval(() => this.updateAndDraw(), 100);
    AudioHub.playLoopingSound(AudioHub.GAME_MUSIC);
  }

  /** Updates game logic and redraws the scene. */
  updateAndDraw() {
    this.updateGame();
    this.draw();
  }

  /** Updates various game elements and checks. */
  updateGame() {
    this.checkThrowObjects();
    this.checkCollisions();
    this.checkCollisionWithEndboss();
    this.checkCollectables();
    this.checkCollectableStones();
    this.checkThrowableObjectCollisions();
    this.checkEndbossActivation();
  }

  /** Handles character throwing logic. */
  checkThrowObjects() {
    if (this.canThrowStone()) this.throwStone();
    else if (!this.keyboard.D) this.isThrowing = false;
  }

  /** @returns {boolean} If character can throw a stone. */
  canThrowStone() {
    return this.keyboard.D && !this.isThrowing && this.character.stones > 0;
  }

  /** Initiates stone throwing. */
  throwStone() {
    this.isThrowing = true;
    const stone = this.createThrowableObject();
    this.throwableObjects.push(stone);
    stone.throw();
    this.updateStoneCount();
    setTimeout(() => (this.isThrowing = false), 500);
  }

  /** @returns {ThrowableObject} A new throwable object near the character. */
  createThrowableObject() {
    return new ThrowableObject(
      this.character.x + this.character.width / 2,
      this.character.y + this.character.height / 2,
      this.character.otherDirection,
    );
  }

  /** Decrements stone count and updates UI. */
  updateStoneCount() {
    this.character.stones--;
    this.collectableStatusBar.setCollectableCount(this.character.stones);
  }

  /** Checks for collisions with enemies. */
  checkCollisions() {
    this.level.enemies.forEach((enemy, index) =>
      this.handleEnemyCollision(enemy, index),
    );
  }

  /** Handles collision with a single enemy. */
  handleEnemyCollision(enemy, index) {
    if (this.character.isColliding(enemy) && !this.character.isDeadCharacter) {
      this.isJumpingOnEnemy(enemy)
        ? this.processJumpOnEnemy(enemy, index)
        : this.processCharacterHit();
    }
  }

  /** @param {Enemy1|Enemy2} enemy - Enemy to check. @returns {boolean} If character is jumping on enemy. */
  isJumpingOnEnemy(enemy) {
    return (
      this.character.isJumping &&
      this.character.speedY <= 0 &&
      this.character.y + this.character.height <= enemy.y + 100
    );
  }

  /** Handles jumping on an enemy. */
  processJumpOnEnemy(enemy, index) {
    enemy.hit();
    this.level.enemies.splice(index, 1);
    this.character.speedY = -5;
    this.character.isJumping = false;
  }

  /** Handles character being hit. */
  processCharacterHit() {
    this.character.hit();
    this.statusBar.setPercentage(this.character.hp);
  }

  /** Checks if end boss activation conditions are met. */
  checkEndbossActivation() {
    if (this.isEndbossPresentAndReady()) this.activateEndbossSequence();
  }

  /** @returns {boolean} If end boss is present and ready. */
  isEndbossPresentAndReady() {
    const endboss = this.level.endboss?.[0];
    return (
      endboss &&
      this.character.x > 2000 &&
      !endboss.isMovingLeft &&
      !endboss.isDead &&
      !endboss.hasAttacked
    );
  }

  /** Initiates end boss activation. */
  activateEndbossSequence() {
    const endboss = this.level.endboss[0];
    AudioHub.stopOneSound(AudioHub.GAME_MUSIC);
    AudioHub.playOneSound(AudioHub.ENDBOSS_ACTIVATION);
    endboss.hasAttacked = true;
    this.startEndbossFight(endboss);
  }

  /** Starts the end boss fight. */
  startEndbossFight(endboss) {
    AudioHub.playLoopingSound(AudioHub.ENDBOSS_FIGHT);
    endboss.playAttackAnimation(() => {
      endboss.isMovingLeft = true;
      endboss.startMovingLeft();
      this.endbossStatusBar = new StatusBarEndboss(this.canvas.width);
    });
  }

  /** Checks for collision with the end boss. */
  checkCollisionWithEndboss() {
    this.level.endboss?.[0]?.let((endboss) => {
      if (this.character.isColliding(endboss)) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.hp);
      }
    });
  }

  /** Checks for throwable object collisions with enemies. */
  checkThrowableObjectCollisions() {
    this.throwableObjects.forEach((to, index) =>
      this.handleThrowableObjectCollision(to, index),
    );
    this.throwableObjects = this.throwableObjects.filter(
      (obj) => !obj.isRemoved,
    );
  }

  /** Handles collision of a throwable object. */
  handleThrowableObjectCollision(throwableObject, throwableIndex) {
    if (throwableObject.isRemoved) return;
    this.level.enemies.forEach((enemy, enemyIndex) => {
      if (throwableObject.isColliding(enemy)) {
        this.playEnemyDeathSound(enemy);
        this.level.enemies.splice(enemyIndex, 1);
        throwableObject.remove();
      }
    });
    this.checkThrowableCollisionWithEndboss(throwableObject);
  }

  /** Checks for throwable object collision with the end boss. */
  checkThrowableCollisionWithEndboss(throwableObject) {
    this.level.endboss?.[0]?.let((endboss) => {
      if (!throwableObject.isRemoved && throwableObject.isColliding(endboss)) {
        endboss.hit(30);
        throwableObject.remove();
        this.endbossStatusBar?.setPercentage(endboss.hp);
        if (endboss.hp <= 0 && !endboss.isDead) endboss.die();
      }
    });
  }

  /** Plays the death sound for an enemy. */
  playEnemyDeathSound(enemy) {
    AudioHub.playOneSound(
      enemy instanceof Enemy1 ? AudioHub.ENEMY1DEAD : AudioHub.ENEMY2DEAD,
    );
  }

  /** Checks for collisions with collectable coins. */
  checkCollectables() {
    this.level.collectables.forEach((c, i) => {
      if (this.character.isColliding(c)) {
        this.level.collectables.splice(i, 1);
        this.statusCoins.increaseCoinCount();
      }
    });
  }

  /** Checks for collisions with collectable stones. */
  checkCollectableStones() {
    this.level.collectableStone.forEach((cs, i) => {
      if (this.character.isColliding(cs)) {
        this.level.collectableStone.splice(i, 1);
        this.collectableStatusBar.setCollectableCount(
          this.collectableStatusBar.collectableCount + 1,
        );
        this.character.stones++;
        AudioHub.playOneSound(AudioHub.COLLECTSTONE);
      }
    });
  }

  /** Draws all game elements on the canvas. */
  draw() {
    if (gameIsOver) return;
    this.clearCanvasAndSetCamera();
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addToMap(this.character);
    this.level.endboss?.forEach(this.addToMap.bind(this));
    this.endbossStatusBar?.let((sb) => {
      sb.x = this.canvas.width - sb.width - 10 - this.camera_x;
      this.addToMap(sb);
    });
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.collectables);
    this.addObjectsToMap(this.level.collectableStone);
    this.throwableObjects
      .filter((obj) => !obj.isRemoved)
      .forEach(this.addToMap.bind(this));
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.addToMap(this.collectableStatusBar);
    this.addToMap(this.statusCoins);
    requestAnimationFrame(() => this.draw());
  }

  /** Clears canvas and applies camera translation. */
  clearCanvasAndSetCamera() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
  }

  /** Adds multiple drawable objects to the map. */
  addObjectsToMap(objects) {
    objects.forEach(this.addToMap.bind(this));
  }

  /** Adds a single drawable object to the map for drawing. */
  addToMap(go) {
    go?.draw(this.ctx);
  }

  /** Clears all active intervals. */
  clearAllIntervals() {
    for (let i = 1; i < 9999; i++) clearInterval(i);
  }
}

// Helper for optional chaining with function execution
Object.prototype.let = function (callback) {
  if (this != null) callback(this);
  return this;
};
