/**
 * @file Defines the CollectableObjects class, representing items that the
 * main character can collect within the game. These objects extend the
 * GameObject class and have a specific image, position, width, and height.
 */

/**
 * Represents a collectable object in the game, such as a coin.
 * Extends the {@link GameObject} class.
 */
class CollectableObjects extends GameObject {
  /**
   * The width of the collectable object's image.
   * @type {number}
   */
  width = 45;
  /**
   * The height of the collectable object's image.
   * @type {number}
   */
  height = 45;

  /**
   * Creates a new CollectableObjects instance.
   * @param {number} x - The initial x-coordinate of the collectable object.
   * @param {number} y - The initial y-coordinate of the collectable object.
   */
  constructor(x, y) {
    super();
    this.loadImage("assets/img/collectables/coin1.png");
    this.x = x;
    this.y = y;
  }
}
