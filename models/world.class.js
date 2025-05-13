/**
 * @file Defines the World class, which manages the game world, including the
 * main character, level, enemies, collectables, status bars, and collision detection.
 * It handles the game loop and drawing of all game elements.
 */

/**
 * Manages the entire game world, including entities, collisions, and rendering.
 */
class World {
  /**
   * The main playable character.
   * @type {MainCharacter}
   */
  character = new MainCharacter();

  /**
   * The current game level, containing background objects, clouds, enemies,
   * collectables (coins and stones), and potentially the end boss.
   * @type {Level}
   */
  level;

  /**
   * The HTML canvas element used for rendering the game.
   * @type {HTMLCanvasElement}
   */
  canvas;

  /**
   * The 2D rendering context of the canvas, used for drawing game elements.
   * @type {CanvasRenderingContext2D}
   */
  ctx;

  /**
   * The keyboard input manager, responsible for tracking pressed keys.
   * @type {Keyboard}
   */
  keyboard;

  /**
   * The current horizontal offset of the camera, used for scrolling the world.
   * @type {number}
   */
  camera_x = 0;

  /**
   * The status bar displaying the main character's health.
   * @type {StatusBar}
   */
  statusBar = new StatusBar();

  /**
   * The status bar displaying the number of collected stones (a collectable item).
   * @type {StatusBarCollectables}
   */
  collectableStatusBar = new StatusBarCollectables();

  /**
   * The status display showing the number of collected coins.
   * @type {StatusCoins}
   */
  statusCoins = new StatusCoins();

  /**
   * An array to hold all currently active throwable objects (like stones thrown by the character).
   * @type {ThrowableObject[]}
   */
  throwableObjects = [];

  /**
   * A boolean flag indicating whether the character is currently in the process of throwing an object.
   * This is used to prevent rapid consecutive throws.
   * @type {boolean}
   */
  isThrowing = false;

  /**
   * The status bar for the end boss's health. It is initially null and created when the end boss appears.
   * @type {StatusBarEndboss|null}
   */
  endbossStatusBar = null;

  /**
   * Creates a new World instance, initializing the canvas, context, keyboard, and level.
   * It also starts the game loop and sets the world reference for the character.
   * @param {HTMLCanvasElement} canvas - The canvas element to render on.
   * @param {Keyboard} keyboard - The keyboard input manager.
   * @param {Level} level - The game level to load.
   */
  constructor(canvas, keyboard, level) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = level;
    this.draw(); // Initial draw to set up the scene
    this.setWorld(); // Set the world reference for the main character
    this.run(); // Start the game loop
  }

  /**
   * Sets the world property of the main character to this World instance,
   * allowing the character to interact with the world (e.g., check collisions).
   */
  setWorld() {
    this.character.world = this;
  }

  /**
   * Starts the main game loop using `setInterval` to periodically perform game updates
   * such as collision checks, object updates, and drawing. It also starts the background music.
   */
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
    }, 100); // Update interval of 100 milliseconds (10 frames per second)
    AudioHub.playLoopingSound(AudioHub.GAME_MUSIC);
  }

  /**
   * Checks if the character intends to throw an object (based on keyboard input and cooldown)
   * and initiates the throwing process if possible.
   */
  checkThrowObjects() {
    if (this.canThrowStone()) {
      this.throwStone();
      this.updateThrowingState();
    } else if (!this.keyboard.D) {
      this.isThrowing = false; // Reset throwing state when the 'D' key is released
    }
  }

  /**
   * Determines if the character is currently able to throw a stone.
   * @returns {boolean} True if the 'D' key is pressed, the character is not already throwing,
   * and the character has at least one stone.
   */
  canThrowStone() {
    return this.keyboard.D && !this.isThrowing && this.character.stones > 0;
  }

  /**
   * Initiates the process of throwing a stone: creates a new ThrowableObject,
   * adds it to the `throwableObjects` array, tells it to start its throwing animation,
   * updates the character's stone count, and sets a timeout to reset the throwing state.
   */
  throwStone() {
    this.isThrowing = true;
    const stone = this.createThrowableObject();
    this.throwableObjects.push(stone);
    stone.throw();
    this.updateStoneCount();
    this.resetThrowingState();
  }

  /**
   * Creates a new ThrowableObject instance positioned near the character.
   * @returns {ThrowableObject} The newly created throwable object.
   */
  createThrowableObject() {
    return new ThrowableObject(
      this.character.x + this.character.width / 2, // Position near the center of the character
      this.character.y + this.character.height / 2,
      this.character.otherDirection, // Set the throwing direction based on character's facing
    );
  }

  /**
   * Decrements the character's stone count and updates the `collectableStatusBar`
   * to reflect the new number of stones.
   */
  updateStoneCount() {
    this.character.stones--;
    this.collectableStatusBar.setCollectableCount(this.character.stones);
  }

  /**
   * Resets the `isThrowing` flag to false after a short delay, allowing the character
   * to throw another stone.
   */
  resetThrowingState() {
    setTimeout(() => {
      this.isThrowing = false;
    }, 500); // Delay of 500 milliseconds before allowing another throw
  }

  /**
   * Updates the `isThrowing` flag to false if the 'D' key is no longer pressed.
   */
  updateThrowingState() {
    if (!this.keyboard.D) {
      this.isThrowing = false;
    }
  }

  /**
   * Iterates through all enemies in the level and checks for collisions with the main character.
   */
  checkCollisions() {
    this.level.enemies.forEach((enemy, index) => {
      this.handleEnemyCollision(enemy, index);
    });
  }

  /**
   * Handles the collision between the main character and a specific enemy.
   * If the character is colliding and not already dead, it checks if the character is jumping
   * on the enemy. If so, it defeats the enemy; otherwise, the character takes damage.
   * @param {Enemy1|Enemy2} enemy - The enemy object involved in the collision.
   * @param {number} index - The index of the enemy in the `level.enemies` array.
   */
  handleEnemyCollision(enemy, index) {
    if (this.character.isColliding(enemy) && !this.character.isDeadCharacter) {
      if (this.isJumpingOnEnemy(enemy)) {
        this.processJumpOnEnemy(enemy, index);
      } else {
        this.processCharacterHit();
      }
    }
  }

  /**
   * Checks if the character is currently jumping and positioned above an enemy,
   * indicating a jump-on-enemy action.
   * @param {Enemy1|Enemy2} enemy - The enemy object to check against.
   * @returns {boolean} True if the character is jumping and above the enemy, false otherwise.
   */
  isJumpingOnEnemy(enemy) {
    return (
      this.character.isJumping &&
      this.character.speedY <= 0 && // Ensure the character is moving downwards or is at the peak of the jump
      this.character.y + this.character.height <= enemy.y + 100 // Check if character's bottom is above enemy's upper part
    );
  }

  /**
   * Processes the event of the character jumping on an enemy: marks the enemy as hit,
   * removes it from the level, and gives the character a small upward bounce.
   * @param {Enemy1|Enemy2} enemy - The enemy object that was jumped on.
   * @param {number} index - The index of the enemy in the `level.enemies` array.
   */
  processJumpOnEnemy(enemy, index) {
    enemy.hit();
    this.level.enemies.splice(index, 1); // Remove the defeated enemy
    this.character.speedY = -5; // Give the character a small upward bounce
    this.character.isJumping = false; // Reset jumping state
  }

  /**
   * Processes the event of the character being hit by an enemy: reduces the character's health
   * and updates the health status bar.
   */
  processCharacterHit() {
    this.character.hit();
    this.statusBar.setPercentage(this.character.hp);
  }

  /**
   * Checks if the conditions are met to activate the end boss fight sequence.
   */
  checkEndbossActivation() {
    if (this.isEndbossPresentAndReady()) {
      this.activateEndbossSequence();
    }
  }

  /**
   * Checks if the end boss exists in the level and if the character has reached a specific
   * position to trigger its appearance and initial behavior.
   * @returns {boolean} True if the end boss is present and the activation conditions are met.
   */
  isEndbossPresentAndReady() {
    if (this.level.endboss && this.level.endboss.length > 0) {
      const endboss = this.level.endboss[0];
      const activationXPosition = 2000; // X-coordinate to trigger end boss appearance
      return (
        this.character.x > activationXPosition &&
        !endboss.isMovingLeft && // Ensure end boss isn't already moving
        !endboss.isDead && // Ensure end boss isn't already defeated
        !endboss.hasAttacked // Ensure end boss hasn't started its initial attack sequence
      );
    }
    return false;
  }

  /**
   * Initiates the end boss activation sequence: stops the game's background music,
   * plays the end boss activation sound, sets a flag on the end boss indicating it has attacked,
   * and starts the end boss fight.
   */
  activateEndbossSequence() {
    const endboss = this.level.endboss[0];
    this.stopGameMusicForEndboss();
    this.playEndbossActivationSound();
    endboss.hasAttacked = true;
    this.startEndbossFight(endboss);
  }

  /**
   * Stops the main game background music when the end boss is activated.
   */
  stopGameMusicForEndboss() {
    AudioHub.stopOneSound(AudioHub.GAME_MUSIC);
  }

  /**
   * Plays the sound effect associated with the end boss activation.
   */
  playEndbossActivationSound() {
    AudioHub.playOneSound(AudioHub.ENDBOSS_ACTIVATION);
  }

  /**
   * Starts the end boss fight sequence: plays the end boss fight music, initiates
   * the end boss's initial attack animation, triggers its movement, and creates
   * and adds its status bar to the world.
   * @param {Endboss} endboss - The end boss object.
   */
  startEndbossFight(endboss) {
    AudioHub.playLoopingSound(AudioHub.ENDBOSS_FIGHT);
    endboss.playAttackAnimation(() => {
      this.triggerEndbossMovement(endboss);
      this.createAndAddEndbossStatusBar();
    });
  }

  /**
   * Sets the end boss's `isMovingLeft` flag to true and starts its leftward movement.
   * @param {Endboss} endboss - The end boss object.
   */
  triggerEndbossMovement(endboss) {
    endboss.isMovingLeft = true;
    endboss.startMovingLeft();
  }

  /**
   * Creates a new `StatusBarEndboss` instance and adds it to the world for drawing.
   */
  createAndAddEndbossStatusBar() {
    this.endbossStatusBar = new StatusBarEndboss(this.canvas.width);
    this.addToMap(this.endbossStatusBar);
  }

  /**
   * Checks for collision between the main character and the end boss. If they are colliding,
   * the character takes damage, and the character's health status bar is updated.
   */
  checkCollisionWithEndboss() {
    if (this.level.endboss && this.level.endboss.length > 0) {
      const endboss = this.level.endboss[0];
      if (this.character.isColliding(endboss)) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.hp);
      }
    }
  }

  /**
   * Iterates through all active throwable objects and checks for collisions with enemies.
   */
  checkThrowableObjectCollisionsWithEnemies() {
    this.throwableObjects.forEach((throwableObject, index) => {
      this.handleThrowableObjectCollision(throwableObject, index);
    });
    this.cleanUpThrowableObjects(); // Remove any throwable objects that have collided or are marked for removal
  }

  /**
   * Handles the collision between a single throwable object and all enemies in the level.
   * If a collision occurs, it processes the hit and marks the throwable object for removal.
   * @param {ThrowableObject} throwableObject - The throwable object to check for collisions.
   * @param {number} throwableIndex - The index of the throwable object in the `throwableObjects` array.
   */
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

  /**
   * Processes the collision between a throwable object and a single enemy.
   * If they are colliding, it plays the enemy's death sound, removes the enemy from the level,
   * and marks the throwable object for removal.
   * @param {ThrowableObject} throwableObject - The throwable object involved in the collision.
   * @param {Enemy1|Enemy2} enemy - The enemy object involved in the collision.
   * @param {number} enemyIndex - The index of the enemy in the `level.enemies` array.
   */
  processThrowableObjectCollisionWithEnemy(throwableObject, enemy, enemyIndex) {
    if (throwableObject.isColliding(enemy)) {
      this.playEnemyDeathSound(enemy);
      this.removeEnemy(enemyIndex);
      throwableObject.remove(); // Mark the throwable object for removal in the next cleanup
    }
  }

  /**
   * Plays the appropriate death sound based on the type of enemy that was hit.
   * @param {Enemy1|Enemy2} enemy - The enemy object that was defeated.
   */
  playEnemyDeathSound(enemy) {
    if (enemy instanceof Enemy1) {
      AudioHub.playOneSound(AudioHub.ENEMY1DEAD);
    } else if (enemy instanceof Enemy2) {
      AudioHub.playOneSound(AudioHub.ENEMY2DEAD);
    }
  }

  /**
   * Removes a specific enemy from the `level.enemies` array.
   * @param {number} enemyIndex - The index of the enemy to remove.
   */
  removeEnemy(enemyIndex) {
    this.level.enemies.splice(enemyIndex, 1);
  }

  /**
   * Removes a throwable object from the `throwableObjects` array if its `isRemoved` property is true.
   * @param {ThrowableObject} throwableObject - The throwable object to potentially remove.
   * @param {number} throwableIndex - The index of the throwable object in the array.
   */
  removeMarkedThrowableObject(throwableObject, throwableIndex) {
    if (throwableObject.isRemoved) {
      this.throwableObjects.splice(throwableIndex, 1);
    }
  }

  /**
   * Filters the `throwableObjects` array, keeping only those that are not marked for removal.
   */
  cleanUpThrowableObjects() {
    this.throwableObjects = this.throwableObjects.filter(
      (obj) => !obj.isRemoved,
    );
  }

  /**
   * Iterates through all active throwable objects and checks for collisions with the end boss.
   */
  checkThrowableObjectCollisionWithEndboss() {
    this.throwableObjects.forEach((throwableObject) => {
      this.handleThrowableCollisionWithEndboss(throwableObject);
    });
    this.cleanUpThrowableObjects();
  }

  /**
   * Handles the collision between a single throwable object and the end boss.
   * If a collision occurs and the end boss is present, it processes the hit.
   * @param {ThrowableObject} throwableObject - The throwable object to check for collision.
   */
  handleThrowableCollisionWithEndboss(throwableObject) {
    if (!throwableObject.isRemoved && this.isEndbossPresent()) {
      const endboss = this.level.endboss[0];
      if (throwableObject.isColliding(endboss)) {
        this.processEndbossHitByThrowable(throwableObject, endboss);
      }
    }
  }

  /**
   * Checks if the end boss is currently present in the level.
   * @returns {boolean} True if the `level.endboss` array exists and has at least one element.
   */
  isEndbossPresent() {
    return this.level.endboss && this.level.endboss.length > 0;
  }

  /**
   * Processes the event of a throwable object hitting the end boss: reduces the end boss's health,
   * marks the throwable object for removal, updates the end boss's status bar, and checks if the
   * end boss has been defeated.
   * @param {ThrowableObject} throwableObject - The throwable object that hit the end boss.
   * @param {Endboss} endboss - The end boss object that was hit.
   */
  processEndbossHitByThrowable(throwableObject, endboss) {
    endboss.hit(30);
    throwableObject.remove();
    this.updateEndbossStatusBar(endboss);
    this.checkEndbossDeath(endboss);
  }

  /**
   * Updates the visual representation of the end boss's health on its status bar.
   * This method only executes if the `endbossStatusBar` is not null.
   * @param {Endboss} endboss - The end boss object whose health is being displayed.
   */
  updateEndbossStatusBar(endboss) {
    if (this.endbossStatusBar) {
      this.endbossStatusBar.setPercentage(endboss.hp);
    }
  }

  /**
   * Checks if the end boss's health has dropped to zero or below and if it's not already marked as dead.
   * If both conditions are true, it triggers the end boss's death sequence.
   * @param {Endboss} endboss - The end boss object to check.
   */
  checkEndbossDeath(endboss) {
    if (endboss.hp <= 0 && !endboss.isDead) {
      endboss.die();
    }
  }

  /**
   * Filters the `throwableObjects` array, keeping only those that are not marked for removal.
   * This is a duplicate of `cleanUpThrowableObjects()` and likely serves the same purpose.
   */
  cleanUpThrowableObjects() {
    this.throwableObjects = this.throwableObjects.filter(
      (obj) => !obj.isRemoved,
    );
  }

  /**
   * Removes a specific throwable object from the `throwableObjects` array.
   * @param {ThrowableObject} throwableObject - The throwable object to remove.
   */
  removeThrowableObject(throwableObject) {
    const index = this.throwableObjects.indexOf(throwableObject);
    if (index > -1) {
      this.throwableObjects.splice(index, 1);
    }
  }

  /**
   * Checks for collisions between the character and collectable coins in the level.
   * If a collision occurs, the coin is removed from the level, and the coin counter is increased.
   */
  checkCollectables() {
    this.level.collectables.forEach((collectable, index) => {
      if (this.character.isColliding(collectable)) {
        this.level.collectables.splice(index, 1);
        this.statusCoins.increaseCoinCount();
      }
    });
  }

  /**
   * Checks for collisions between the character and collectable stones in the level.
   * If a collision occurs, the stone is removed from the level, the collectable stone counter
   * is increased, the character's stone inventory is updated, and a collection sound is played.
   */
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

  /**
   * Draws all elements of the game world on the canvas. This function is called repeatedly
   * to update the game display. It checks if the game is over before proceeding.
   */
  draw() {
    if (gameIsOver) return;
    this.clearCanvasAndSetCamera();
    this.drawBackgroundElements();
    this.drawCharacterAndEndboss();
    this.drawInteractiveElements();
    this.resetCameraAndDrawUI();
    this.requestNextFrame();
  }

  /**
   * Clears the entire canvas and applies the camera transformation to enable scrolling.
   */
  clearCanvasAndSetCamera() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
  }

  /**
   * Draws the background elements of the level, including static background objects and clouds.
   */
  drawBackgroundElements() {
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
  }

  /**
   * Draws the main character and the end boss (if present) on the canvas.
   */
  drawCharacterAndEndboss() {
    this.addToMap(this.character);
    this.drawEndbossWithStatusBar();
  }

  /**
   * Draws the end boss and its status bar if the end boss exists in the level.
   */
  drawEndbossWithStatusBar() {
    if (this.level.endboss && this.level.endboss.length > 0) {
      const endboss = this.level.endboss[0];
      this.addToMap(endboss);
      this.positionAndDrawEndbossStatusBar();
    }
  }

  /**
   * Positions the end boss's status bar at the top right of the screen and draws it.
   * This method only executes if `endbossStatusBar` is not null.
   */
  positionAndDrawEndbossStatusBar() {
    if (this.endbossStatusBar) {
      this.endbossStatusBar.x =
        this.canvas.width - this.endbossStatusBar.width - 10 - this.camera_x;
      this.addToMap(this.endbossStatusBar);
    }
  }

  /**
   * Draws interactive elements of the level, such as enemies, collectable items (coins and stones),
   * and currently active throwable objects.
   */
  drawInteractiveElements() {
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.collectables);
    this.addObjectsToMap(this.level.collectableStone);
    this.addObjectsToMap(this.getActiveThrowableObjects());
  }

  /**
   * Returns an array of throwable objects that are currently active (not marked for removal).
   * @returns {ThrowableObject[]} An array of active throwable objects.
   */
  getActiveThrowableObjects() {
    return this.throwableObjects.filter((obj) => !obj.isRemoved);
  }

  /**
   * Resets the camera transformation and draws the user interface elements,
   * such as the character's health status bar, the collectable stone status bar, and the coin counter.
   */
  resetCameraAndDrawUI() {
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.addToMap(this.collectableStatusBar);
    this.addToMap(this.statusCoins);
  }

  /**
   * Requests the next animation frame to ensure smooth and efficient rendering of the game.
   */
  requestNextFrame() {
    self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  /**
   * Adds an array of `DrawableObject` instances to the map for rendering.
   * @param {DrawableObject[]} objects - An array of drawable game objects.
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Clears all active intervals that might be running in the game.
   * This can be useful for pausing or ending the game.
   */
  clearAllIntervals() {
    for (let i = 1; i < 9999; i++) window.clearInterval(i);
  }

  /**
   * Adds a single `DrawableObject` to the map and draws it on the canvas.
   * If the object is an instance of a character, enemy, collectable, or throwable object,
   * it also draws its collision box for debugging or visual representation.
   * @param {DrawableObject} go - The drawable game object to add and draw.
   */
  addToMap(go) {
    if (go instanceof DrawableObject) {
      go.draw(this.ctx);
    }
  }
}
