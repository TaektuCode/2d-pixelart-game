/**
 * @file Defines the MainCharacter class, representing the player-controlled
 * character in the game. It extends the GameObject class and includes specific
 * properties and behaviors for movement, jumping, attacking, health, and animations.
 */

/**
 * Represents the main playable character in the game.
 * Extends the {@link GameObject} class.
 */
class MainCharacter extends GameObject {
  /**
   * The fixed y-coordinate of the character on the ground.
   * @type {number}
   */
  y = 330;
  /**
   * The movement speed of the character.
   * @type {number}
   */
  speed = 5.2;
  /**
   * The number of stones the character currently possesses for throwing.
   * @type {number}
   */
  stones = 0;
  /**
   * The cooldown period in milliseconds after being hit by an enemy.
   * @type {number}
   */
  hitByEnemyCooldown = 1000;
  /**
   * Indicates if the character is currently jumping.
   * @type {boolean}
   */
  isJumping = false;
  /**
   * Indicates if the character is dead.
   * @type {boolean}
   */
  isDeadCharacter = false;
  /**
   * Interval ID for the death animation.
   * @type {number|null}
   */
  deathAnimationInterval = null;
  /**
   * Delay in milliseconds between walk sound effects.
   * @type {number}
   */
  walkSoundDelay = 330;
  /**
   * The timestamp of the last walk sound played.
   * @type {number}
   */
  lastWalkSoundTime = 0;
  /**
   * Array of image paths for the walking animation.
   * @type {string[]}
   */
  IMAGES_WALKING = [
    "assets/img/character/walk/walk1.png",
    "assets/img/character/walk/walk2.png",
    "assets/img/character/walk/walk3.png",
    "assets/img/character/walk/walk4.png",
    "assets/img/character/walk/walk5.png",
    "assets/img/character/walk/walk6.png",
  ];
  /**
   * Array of image paths for the jumping animation.
   * @type {string[]}
   */
  IMAGES_JUMPING = [
    "assets/img/character/jump/jump1.png",
    "assets/img/character/jump/jump2.png",
    "assets/img/character/jump/jump3.png",
    "assets/img/character/jump/jump4.png",
    "assets/img/character/jump/jump5.png",
    "assets/img/character/jump/jump6.png",
    "assets/img/character/jump/jump7.png",
  ];
  /**
   * Array of image paths for the death animation.
   * @type {string[]}
   */
  IMAGES_DEAD = [
    "assets/img/character/dead/death1.png",
    "assets/img/character/dead/death2.png",
    "assets/img/character/dead/death3.png",
    "assets/img/character/dead/death4.png",
    "assets/img/character/dead/death5.png",
    "assets/img/character/dead/death6.png",
    "assets/img/character/dead/death7.png",
    "assets/img/character/dead/death8.png",
    "assets/img/character/dead/death9.png",
    "assets/img/character/dead/death10.png",
  ];
  /**
   * Array of image paths for the hurt animation.
   * @type {string[]}
   */
  IMAGES_HURT = [
    "assets/img/character/hurt/hurt1.png",
    "assets/img/character/hurt/hurt2.png",
    "assets/img/character/hurt/hurt3.png",
    "assets/img/character/hurt/hurt4.png",
  ];
  /**
   * Reference to the game world object.
   * @type {World}
   */
  world;
  /**
   * The offset for the collision box of the character.
   * @type {Object}
   * @property {number} top - The top offset.
   * @property {number} left - The left offset.
   * @property {number} right - The right offset.
   * @property {number} bottom - The bottom offset.
   */
  offset = {
    top: 75,
    left: 50,
    right: 110,
    bottom: 25,
  };

  /**
   * Creates a new MainCharacter instance.
   */
  constructor() {
    super();
    this.loadImage("assets/img/character/walk/walk1.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.applyGravity();
    this.animate();
  }

  /**
   * Initiates the animation and movement intervals for the character.
   */
  animate() {
    this.startMovementInterval();
    this.startAnimationInterval();
  }

  /**
   * Starts the interval for updating the character's movement based on keyboard input.
   */
  startMovementInterval() {
    setInterval(this.updateMovement.bind(this), 1000 / 60);
  }

  /**
   * Updates the character's movement based on keyboard input and updates the camera position.
   */
  updateMovement() {
    if (this.canMove()) {
      this.handleRightMovement();
      this.handleLeftMovement();
      this.handleJumpInput();
      this.updateCameraPosition();
    }
  }

  /**
   * Handles movement to the right based on keyboard input and level boundaries.
   */
  handleRightMovement() {
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
    }
  }

  /**
   * Handles movement to the left based on keyboard input and level boundaries.
   */
  handleLeftMovement() {
    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
    }
  }

  /**
   * Handles jump input based on keyboard input and whether the character is above ground.
   */
  handleJumpInput() {
    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
    }
  }

  /**
   * Updates the camera's x-position to follow the character.
   */
  updateCameraPosition() {
    this.world.camera_x = -this.x + 100;
  }

  /**
   * Starts the interval for updating the character's animation based on its state.
   */
  startAnimationInterval() {
    setInterval(this.updateAnimation.bind(this), 130);
  }

  /**
   * Updates the character's animation based on its current state (dead, hurt, jumping, walking/idle).
   */
  updateAnimation() {
    if (this.isDead()) this.playDeathAnimation();
    else if (this.isHurt()) this.playHurtAnimation();
    else if (this.isAboveGround()) this.playJumpingAnimation();
    else this.playWalkingOrIdleAnimation();
  }

  /**
   * Plays the hurt animation sequence.
   */
  playHurtAnimation() {
    this.playAnimation(this.IMAGES_HURT);
  }

  /**
   * Plays the jumping animation sequence.
   */
  playJumpingAnimation() {
    this.playAnimation(this.IMAGES_JUMPING);
  }

  /**
   * Plays the walking animation if moving, otherwise displays the idle animation.
   */
  playWalkingOrIdleAnimation() {
    if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playAnimation(this.IMAGES_WALKING);
    } else {
      this.img = this.imageCache[this.IMAGES_WALKING[0]];
    }
  }

  /**
   * Checks if the character can currently move.
   * @returns {boolean} True if the character is not dead, false otherwise.
   */
  canMove() {
    return !this.isDeadCharacter;
  }

  /**
   * Plays the death animation sequence and triggers the game over screen.
   */
  playDeathAnimation() {
    if (!this.isDeadCharacter) {
      this.isDeadCharacter = true;
      AudioHub.playOneSound(AudioHub.CHARACTERDEATH);
      let i = 0;
      this.deathAnimationInterval = setInterval(() => {
        this.img = this.imageCache[this.IMAGES_DEAD[i]];
        i++;
        if (i >= this.IMAGES_DEAD.length) {
          clearInterval(this.deathAnimationInterval);
          setTimeout(() => {
            gameOver();
          }, 2000);
        }
      }, 130);
    }
  }

  /**
   * Moves the character to the left and plays the walking sound effect.
   */
  moveLeft() {
    this.x -= this.speed;
    const currentTime = Date.now();
    if (
      currentTime - this.lastWalkSoundTime > this.walkSoundDelay &&
      !this.isAboveGround()
    ) {
      AudioHub.playOneSound(AudioHub.CHARACTERWALK);
      this.lastWalkSoundTime = currentTime;
    }
    this.otherDirection = true;
  }

  /**
   * Moves the character to the right and plays the walking sound effect.
   */
  moveRight() {
    this.x += this.speed;
    const currentTime = Date.now();
    if (
      currentTime - this.lastWalkSoundTime > this.walkSoundDelay &&
      !this.isAboveGround()
    ) {
      AudioHub.playOneSound(AudioHub.CHARACTERWALK);
      this.lastWalkSoundTime = currentTime;
    }
    this.otherDirection = false;
  }

  /**
   * Makes the character jump by setting its vertical speed and playing the jump sound.
   */
  jump() {
    this.speedY = 19.5;
    this.isJumping = true;
    AudioHub.playOneSound(AudioHub.CHARACTERJUMP);
  }

  /**
   * Handles the character being hit by an enemy, reducing health and playing the hurt sound.
   * Has a cooldown period to prevent rapid health loss.
   */
  hit() {
    if (!this.isDeadCharacter) {
      const currentTime = Date.now();
      if (currentTime - this.lastHit > this.hitByEnemyCooldown) {
        this.hp -= 25;
        this.lastHit = currentTime;
        AudioHub.playOneSound(AudioHub.CHARACTERHURT);
        if (this.hp <= 0) {
          this.hp = 0;
        }
      }
    }
  }
}
