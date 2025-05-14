/**
 * @file Defines the Endboss class, representing the final boss enemy in the game.
 * It extends the GameObject class and includes specific behaviors for movement,
 * attacking, getting hit, and dying, along with corresponding animations and sounds.
 */

/**
 * Represents the final boss enemy in the game.
 * Extends the {@link GameObject} class.
 */
class Endboss extends GameObject {
  /**
   * The fixed y-coordinate of the endboss.
   * @type {number}
   */
  y = 200;
  /**
   * The width of the endboss image.
   * @type {number}
   */
  width = 400;
  /**
   * The height of the endboss image.
   * @type {number}
   */
  height = 350;
  /**
   * Indicates if the endboss is dead.
   * @type {boolean}
   */
  isDead = false;
  /**
   * Indicates if the endboss is currently moving to the left.
   * @type {boolean}
   */
  isMovingLeft = false;
  /**
   * Indicates if the endboss is in a hit state (playing the hurt animation).
   * @type {boolean}
   */
  isHitState = false;
  /**
   * The timestamp of the last time the endboss was hit.
   * @type {number}
   */
  lastHitTime = 0;
  /**
   * The duration of the hurt animation in milliseconds.
   * @type {number}
   */
  hurtAnimationDuration = 500;
  /**
   * Flag indicating if the endboss should be removed from the game world.
   * @type {boolean}
   */
  toBeRemoved = false;
  /**
   * Interval ID for the death animation.
   * @type {number|null}
   */
  deathAnimationInterval = null;
  /**
   * The current frame index of the death animation.
   * @type {number}
   */
  deathAnimationFrame = 0;
  /**
   * Delay in milliseconds between step sounds when moving.
   * @type {number}
   */
  stepSoundDelay = 500;
  /**
   * The timestamp of the last step sound played.
   * @type {number}
   */
  lastStepSoundTime = 0;
  /**
   * Interval ID for Attackanimation.
   * @type {number|null}
   */
  attackInterval = null;
  /**
   * Gibt an, ob der Endboss gerade angreift.
   * @type {boolean}
   */
  isAttacking = false;
  /**
   * Array of image paths for the walking animation (flipped).
   * @type {string[]}
   */
  IMAGES_WALKING = [
    "assets/img/endboss/walk/Walk1_flip.png",
    "assets/img/endboss/walk/Walk2_flip.png",
    "assets/img/endboss/walk/Walk3_flip.png",
    "assets/img/endboss/walk/Walk4_flip.png",
    "assets/img/endboss/walk/Walk5_flip.png",
    "assets/img/endboss/walk/Walk6_flip.png",
  ];
  /**
   * Array of image paths for the attack animation (flipped).
   * @type {string[]}
   */
  IMAGES_ATTACK = [
    "assets/img/endboss/attack/Attack1_flip.png",
    "assets/img/endboss/attack/Attack2_flip.png",
    "assets/img/endboss/attack/Attack3_flip.png",
    "assets/img/endboss/attack/Attack4_flip.png",
  ];
  /**
   * Array of image paths for the hurt animation (flipped).
   * @type {string[]}
   */
  IMAGES_HURT = [
    "assets/img/endboss/hurt/Hurt1_flip.png",
    "assets/img/endboss/hurt/Hurt2_flip.png",
  ];
  /**
   * Array of image paths for the death animation (flipped).
   * @type {string[]}
   */
  IMAGES_DEAD = [
    "assets/img/endboss/death/Death1_flip.png",
    "assets/img/endboss/death/Death2_flip.png",
    "assets/img/endboss/death/Death3_flip.png",
    "assets/img/endboss/death/Death4_flip.png",
    "assets/img/endboss/death/Death5_flip.png",
    "assets/img/endboss/death/Death6_flip.png",
  ];
  /**
   * The offset for the collision box of the endboss.
   * @type {Object}
   * @property {number} top - The top offset.
   * @property {number} left - The left offset.
   * @property {number} right - The right offset.
   * @property {number} bottom - The bottom offset.
   */
  offset = {
    top: 130,
    left: 185,
    right: 90,
    bottom: 90,
  };

  /**
   * Indicates if the endboss is currently activated and should perform attacks.
   * @type {boolean}
   */
  isActivated = false;

  /**
   * Creates a new Endboss instance.
   */
  constructor() {
    super();
    this.loadImage("assets/img/endboss/walk/Walk1_flip.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_ATTACK);
    this.x = 2550;
    this.hp = 90;
    this.speed = 0.45;
    this.animate();
    this.isMovingLeft = false;
  }

  /**
   * Sets the activation state of the endboss and starts the attack interval.
   */
  activate() {
    this.isActivated = true;
    // Starte den Angriffs-Timer, wenn der Boss aktiviert ist
    setInterval(() => {
      if (
        this.isActivated &&
        !this.isDead &&
        !this.isHitState &&
        !this.isAttacking
      ) {
        this.isMovingLeft = false; // Bewegung stoppen
        this.isAttacking = true; // Setze das Angriffs-Flag
        this.playAttackAnimation(() => {
          // Callback-Funktion, die ausgeführt wird, nachdem die Attackenanimation abgeschlossen ist
          this.isAttacking = false; // Reset des Angriffs-Flags
          this.isMovingLeft = true; // Bewegung wieder starten
        });
      }
    }, 2000); // Alle 2000 Millisekunden (2 Sekunden)
  }

  /**
   * Initiates the animation loop for the endboss, handling hurt and walking states.
   */
  animate() {
    setInterval(() => {
      if (this.isHitState && !this.isDead) {
        this.playAnimation(this.IMAGES_HURT);
        if (Date.now() - this.lastHitTime > this.hurtAnimationDuration) {
          this.isHitState = false;
          this.isMovingLeft = true;
        }
      } else if (this.isMovingLeft) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 200);
  }

  /**
   * Initiates the death animation sequence.
   */
  animateDeath() {
    let i = 0;
    this.deathAnimationInterval = setInterval(() => {
      this.img = this.imageCache[this.IMAGES_DEAD[i % this.IMAGES_DEAD.length]];
      i++;
      if (i >= this.IMAGES_DEAD.length) {
        clearInterval(this.deathAnimationInterval);
        setTimeout(() => {
          gameWon();
        }, 2000);
      }
    }, 215);
  }

  /**
   * Starts the movement of the endboss to the left, including playing step sounds.
   */
  startMovingLeft() {
    this.isMovingLeft = true;
    setInterval(() => {
      if (this.isMovingLeft) {
        this.moveLeft();
        const currentTime = Date.now();
        if (currentTime - this.lastStepSoundTime > this.stepSoundDelay) {
          AudioHub.playOneSound(AudioHub.ENDBOSS_STEP);
          this.lastStepSoundTime = currentTime;
        }
      }
    }, 1000 / 60);
  }

  /**
   * Handles the endboss getting hit, reducing health, triggering the hurt animation,
   * and checking for death.
   * @param {number} damage - The amount of damage taken.
   */
  hit(damage) {
    this.hp -= damage;
    this.isHitState = true;
    AudioHub.playOneSound(AudioHub.ENDBOSS_HURT);
    this.isMovingLeft = false;
    this.lastHitTime = Date.now();
    if (this.isAttacking) {
      clearInterval(this.attackInterval);
      this.isAttacking = false;
      this.resetHitbox();
    }
    if (this.hp <= 0 && !this.isDead) {
      this.die();
    }
  }

  /**
   * Initiates the death sequence of the endboss.
   */
  /**
   * Initiates the death sequence of the endboss.
   */
  die() {
    this.isDead = true;
    AudioHub.playOneSound(AudioHub.ENDBOSS_DEATH);
    this.isMovingLeft = false;
    this.isHitState = false;
    if (this.isAttacking) {
      clearInterval(this.attackInterval);
      this.isAttacking = false;
      this.resetHitbox();
    }
    this.animateDeath();
  }

  /**
   * Applies the attack hitbox by decreasing the left offset.
   */
  applyAttackHitbox() {
    this.originalOffsetLeft = this.offset.left;
    this.offset.left -= 100;
  }

  /**
   * Resets the hitbox to its original state.
   */
  resetHitbox() {
    this.offset.left = this.originalOffsetLeft;
  }

  /**
   * Plays the attack animation sequence and optionally executes a callback function
   * when the animation is complete.
   * @param {Function} [callback] - An optional function to execute after the attack animation.
   */
  playAttackAnimation(callback) {
    clearInterval(this.attackInterval);
    let i = 0;

    this.applyAttackHitbox();
    this.playAnimation(this.IMAGES_ATTACK);
    i++;
    AudioHub.playOneSound(AudioHub.ENDBOSS_ACTIVATION);

    this.attackInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_ATTACK);
      i++;
      if (i >= this.IMAGES_ATTACK.length) {
        clearInterval(this.attackInterval);
        this.resetHitbox();
        if (callback) {
          callback();
        }
      }
    }, 200);
  }
  /**
   * Marks the endboss to be removed from the game world.
   */
  removeFromWorld() {
    this.toBeRemoved = true;
  }
}
