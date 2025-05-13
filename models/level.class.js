/**
 * @file Defines the Level class, which encapsulates all the elements of a game level,
 * including enemies, clouds, background objects, collectables, and the end boss.
 */

/**
 * Represents a single level in the game, containing all its entities.
 */
class Level {
  /**
   * An array containing the end boss of the level.
   * @type {Endboss[]}
   */
  endboss;
  /**
   * An array containing the regular enemies in the level.
   * @type {(Enemy1|Enemy2)[]}
   */
  enemies;
  /**
   * An array containing the cloud objects in the level.
   * @type {Cloud[]}
   */
  clouds;
  /**
   * An array containing the static background objects in the level.
   * @type {BackgroundObject[]}
   */
  backgroundObjects;
  /**
   * An array containing the collectable objects (e.g., coins) in the level.
   * @type {CollectableObjects[]}
   */
  collectables;
  /**
   * An array containing the collectable stone objects in the level.
   * @type {CollectableStone[]}
   */
  collectableStone;
  /**
   * The x-coordinate at which the level ends.
   * @type {number}
   */
  level_end_x = 2500;

  /**
   * Creates a new Level instance.
   * @param {Endboss[]} endboss - An array containing the end boss.
   * @param {(Enemy1|Enemy2)[]} enemies - An array containing the enemies.
   * @param {Cloud[]} clouds - An array containing the clouds.
   * @param {BackgroundObject[]} backgroundObjects - An array containing the background objects.
   * @param {CollectableObjects[]} collectables - An array containing the collectable objects.
   * @param {CollectableStone[]} collectableStone - An array containing the collectable stones.
   */
  constructor(
    endboss,
    enemies,
    clouds,
    backgroundObjects,
    collectables,
    collectableStone,
  ) {
    this.endboss = endboss;
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.collectables = collectables;
    this.collectableStone = collectableStone;
  }
}
