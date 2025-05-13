/**
 * @file Defines the GameObject class, which extends DrawableObject and provides
 * fundamental game object properties and behaviors such as speed, gravity,
 * collision detection, health management, movement, and animation playback.
 */

/**
 * Represents a basic game object with physical properties and behaviors.
 * Extends the {@link DrawableObject} class.
 */
class GameObject extends DrawableObject {
  /**
   * The horizontal speed of the game object.
   * @type {number}
   */
  speed = 0.15;
  /**
   * The vertical speed of the game object, used for gravity and jumping.
   * @type {number}
   */
  speedY = 0;
  /**
   * The velocity applied by gravity.
   * @type {number}
   */
  velocity = 1.75;
  /**
   * Indicates if the object is facing the other direction (used for flipping).
   * Inherited from {@link DrawableObject}.
   * @type {boolean}
   */
  otherDirection = false;
  /**
   * The current health points of the game object.
   * @type {number}
   */
  hp = 100;
  /**
   * The timestamp of the last time the object was hit.
   * @type {number}
   */
  lastHit = 0;
  /**
   * The offset for the collision box relative to the object's position and dimensions.
   * @type {Object}
   * @property {number} top - The top offset.
   * @property {number} left - The left offset.
   * @property {number} right - The right offset.
   * @property {number} bottom - The bottom offset.
   */
  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  /**
   * Applies gravity to the game object, affecting its vertical position and speed.
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.velocity;
      }
      if (!this.isAboveGround() && this.speedY < 0) {
        this.y = 330;
        this.speedY = 0;
      }
    }, 1000 / 20);
  }

  /**
   * Checks if the game object is currently above the ground.
   * Throwable objects have a different ground level.
   * @returns {boolean} True if the object is above the ground, false otherwise.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return this.y < 500;
    }
    return this.y < 325;
  }

  /**
   * Checks if this game object is colliding with another game object.
   * @param {GameObject} go - The other game object to check collision with.
   * @returns {boolean} True if a collision is occurring, false otherwise.
   */
  isColliding(go) {
    const charCoords = this.getCollisionCoordinates();
    const goCoords = go.getCollisionCoordinates();
    return this.checkCollision(charCoords, goCoords);
  }

  /**
   * Gets the coordinates of the collision box for this game object, considering the offset.
   * @returns {Object} An object with `left`, `right`, `top`, and `bottom` properties representing the collision box.
   */
  getCollisionCoordinates() {
    return {
      left: this.x + this.offset.left,
      right: this.x + this.width - this.offset.right,
      top: this.y + this.offset.top,
      bottom: this.y + this.height - this.offset.bottom,
    };
  }

  /**
   * Checks if two collision boxes are overlapping.
   * @param {Object} char - The collision coordinates of the first object (with `left`, `right`, `top`, `bottom`).
   * @param {Object} other - The collision coordinates of the second object.
   * @returns {boolean} True if the collision boxes overlap, false otherwise.
   */
  checkCollision(char, other) {
    return (
      char.right > other.left &&
      char.bottom > other.top &&
      char.left < other.right &&
      char.top < other.bottom
    );
  }

  /**
   * Reduces the health of the game object when hit and updates the last hit time.
   */
  hit() {
    this.hp -= 5;
    if (this.hp <= 0) {
      this.hp = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Checks if the game object is currently in a "hurt" state based on the time since the last hit.
   * @returns {boolean} True if the object was hit less than 1 second ago, false otherwise.
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  /**
   * Checks if the game object is dead (health is 0).
   * @returns {boolean} True if the object's health is 0, false otherwise.
   */
  isDead() {
    return this.hp == 0;
  }

  /**
   * Moves the game object to the right by its current speed.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the game object to the left by its current speed.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Plays an animation by cycling through an array of image paths.
   * Updates the `img` property with the next image in the sequence.
   * @param {string[]} images - An array of image paths for the animation frames.
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Applies an upward force to the game object, initiating a jump.
   */
  jump() {
    this.speedY = 30;
  }
}
