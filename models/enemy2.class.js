/**
 * @file Defines the Enemy2 class, representing another type of basic enemy in the game.
 * It extends the GameObject class and includes specific animations and behaviors
 * for movement and being hit, similar to Enemy1 but with different visuals and sound.
 */

/**
 * Represents a second type of basic enemy in the game.
 * Extends the {@link GameObject} class.
 */
class Enemy2 extends GameObject {
  /**
   * The width of the enemy image.
   * @type {number}
   */
  width = 150;
  /**
   * The height of the enemy image.
   * @type {number}
   */
  height = 100;
  /**
   * The fixed y-coordinate of the enemy.
   * @type {number}
   */
  y = 385;
  /**
   * Indicates if the enemy is dead.
   * @type {boolean}
   */
  isDeadEnemy = false;
  /**
   * Array of image paths for the walking animation (flipped).
   * @type {string[]}
   */
  IMAGES_WALKING = [
    "assets/img/enemy2/walk/Walk1_flip.png",
    "assets/img/enemy2/walk/Walk2_flip.png",
    "assets/img/enemy2/walk/Walk3_flip.png",
    "assets/img/enemy2/walk/Walk4_flip.png",
    "assets/img/enemy2/walk/Walk5_flip.png",
    "assets/img/enemy2/walk/Walk6_flip.png",
  ];
  /**
   * The offset for the collision box of the enemy.
   * @type {Object}
   * @property {number} top - The top offset.
   * @property {number} left - The left offset.
   * @property {number} right - The right offset.
   * @property {number} bottom - The bottom offset.
   */
  offset = {
    top: 20,
    left: 40,
    right: 70,
    bottom: 25,
  };

  /**
   * Creates a new Enemy2 instance.
   */
  constructor() {
    super();
    this.loadImage("assets/img/enemy2/walk/Walk1_flip.png");
    this.loadImages(this.IMAGES_WALKING);

    this.x = 200 + Math.random() * 500;
    this.speed = 0.15 + Math.random() * 0.5;
    this.animate();
  }

  /**
   * Initiates the animation loop for the enemy, handling movement and sprite changes.
   */
  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);
    setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 100);
  }

  /**
   * Handles the enemy getting hit, setting its health to 0 and playing a death sound.
   */
  hit() {
    this.hp = 0;
    if (!this.isDeadEnemy) {
      AudioHub.playOneSound(AudioHub.ENEMY2DEAD);
      this.isDeadEnemy = true;
    }
  }

  /**
   * Checks if the enemy is dead (health is 0 or less).
   * @returns {boolean} True if the enemy is dead, false otherwise.
   */
  isDead() {
    return this.hp <= 0;
  }
}
