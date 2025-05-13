/**
 * @file Defines the Cloud class, which represents moving cloud objects in the game.
 * It extends the GameObject class and handles the animation of the clouds moving
 * from right to left.
 */

/**
 * Represents a moving cloud object in the game.
 * Extends the {@link GameObject} class.
 */
class Cloud extends GameObject {
  /**
   * The fixed y-coordinate of the cloud.
   * @type {number}
   */
  y = -50;
  /**
   * The width of the cloud image.
   * @type {number}
   */
  width = 740;
  /**
   * The height of the cloud image.
   * @type {number}
   */
  height = 400;

  /**
   * Creates a new Cloud object.
   * @param {string} imagePath - The path to the image file for the cloud.
   * @param {number} x - The initial x-coordinate of the cloud.
   */
  constructor(imagePath, x) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.animate();
  }

  /**
   * Initiates the animation of the cloud, which is moving to the left.
   */
  animate() {
    this.moveLeft();
  }
}
