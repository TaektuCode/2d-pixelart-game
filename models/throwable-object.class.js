/**
 * @file Defines the ThrowableObject class, representing objects that can be
 * thrown by the main character, such as stones. It extends the GameObject class
 * and includes specific properties and behaviors for its trajectory and removal.
 */

/**
 * Represents an object that can be thrown by the main character.
 * Extends the {@link GameObject} class.
 */
class ThrowableObject extends GameObject {
  /**
   * The vertical acceleration due to gravity affecting the thrown object.
   * @type {number}
   */
  accelerationY = -1.5;
  /**
   * Indicates if the thrown object is currently falling.
   * @type {boolean}
   */
  isFalling = true;
  /**
   * Interval ID for the throw animation and physics update.
   * @type {number|null}
   */
  throwInterval = null;
  /**
   * Indicates if the thrown object should be removed from the game world.
   * @type {boolean}
   */
  isRemoved = false;
  /**
   * The initial y-coordinate from which the object was thrown.
   * @type {number}
   */
  startY;
  /**
   * The direction in which the object is thrown (-1 for left, 1 for right).
   * @type {number}
   */
  direction;
  /**
   * The offset for the collision box of the throwable object.
   * @type {Object}
   * @property {number} top - The top offset.
   * @property {number} left - The left offset.
   * @property {number} right - The right offset.
   * @property {number} bottom - The bottom offset.
   */
  offset = { top: 15, left: 15, right: 15, bottom: 15 };

  /**
   * Creates a new ThrowableObject instance.
   * @param {number} x - The initial x-coordinate of the thrown object.
   * @param {number} y - The initial y-coordinate of the thrown object.
   * @param {boolean} characterOtherDirection - True if the character was facing left when thrown, false otherwise.
   */
  constructor(x, y, characterOtherDirection) {
    super(x, y);
    this.loadImage("assets/img/character/attack/stone.png");
    this.x = x - 30;
    this.y = y;
    this.startY = y;
    this.width = 60;
    this.height = 60;
    this.speedY = 20;
    this.direction = characterOtherDirection ? -1 : 1;
    this.throw();
  }

  /**
   * Initiates the throwing action, setting up the trajectory and physics.
   */
  throw() {
    AudioHub.playOneSound(AudioHub.THROWSTONE);
    this.throwInterval = setInterval(() => {
      this.x += 10 * this.direction;

      if (this.isFalling) {
        this.y -= this.speedY;
        this.speedY += this.accelerationY;

        if (this.speedY < -35 && this.y > 350) {
          this.remove();
        }
      }
    }, 50);
  }

  /**
   * Marks the throwable object for removal and clears its animation interval.
   */
  remove() {
    this.isRemoved = true;
    clearInterval(this.throwInterval);
  }

  /**
   * Checks if the throwable object is colliding with another game object.
   * @param {GameObject} otherObject - The other game object to check collision with.
   * @returns {boolean} True if a collision is occurring, false otherwise.
   */
  isColliding(otherObject) {
    return super.isColliding(otherObject);
  }
}
