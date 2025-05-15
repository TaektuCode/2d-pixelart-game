/**
 * @file Defines the BackgroundObject class, which represents static background
 * elements in the game. It extends the GameObject class and sets a default
 * width and height for background images.
 */

/**
 * Represents a static background object in the game.
 * Extends the {@link GameObject} class.
 */
class BackgroundObject extends GameObject {
  /**
   * The default width of the background object.
   * @type {number}
   */
  width = 721;
  /**
   * The default height of the background object.
   * @type {number}
   */
  height = 480;

  /**
   * Creates a new BackgroundObject.
   * @param {string} imagePath - The path to the image file for the background object.
   * @param {number} x - The initial x-coordinate of the background object.
   * @param {number} y - The initial y-coordinate of the background object.
   */
  constructor(imagePath, x, y) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.y = y;
  }
}
