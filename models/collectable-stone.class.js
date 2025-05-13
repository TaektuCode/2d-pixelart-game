/**
 * @file Defines the CollectableStone class, representing stones that the
 * main character can collect to use as ammunition. These objects extend the
 * GameObject class and have a specific image, position, width, height, and offset.
 */

/**
 * Represents a collectable stone in the game.
 * Extends the {@link GameObject} class.
 */
class CollectableStone extends GameObject {
  /**
   * The width of the collectable stone's image.
   * @type {number}
   */
  width = 45;
  /**
   * The height of the collectable stone's image.
   * @type {number}
   */
  height = 45;

  /**
   * The offset for the collision box of the collectable stone.
   * @type {Object}
   * @property {number} top - The top offset.
   * @property {number} left - The left offset.
   * @property {number} right - The right offset.
   * @property {number} bottom - The bottom offset.
   */
  offset = {
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
  };

  /**
   * Creates a new CollectableStone instance.
   * @param {number} x - The initial x-coordinate of the collectable stone.
   * @param {number} y - The initial y-coordinate of the collectable stone.
   */
  constructor(x, y) {
    super();
    this.loadImage("assets/img/character/attack/stone.png");
    this.x = x;
    this.y = y;
  }
}
