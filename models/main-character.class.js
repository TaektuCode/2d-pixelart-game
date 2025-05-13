class MainCharacter extends GameObject {
  y = 330;
  speed = 5.2;
  stones = 0;
  hitByEnemyCooldown = 1000;
  isJumping = false;
  isDeadCharacter = false;
  deathAnimationInterval;
  walkSoundDelay = 330; // Verzögerung in Millisekunden (anpassen)
  lastWalkSoundTime = 0;

  IMAGES_WALKING = [
    "assets/img/character/walk/walk1.png",
    "assets/img/character/walk/walk2.png",
    "assets/img/character/walk/walk3.png",
    "assets/img/character/walk/walk4.png",
    "assets/img/character/walk/walk5.png",
    "assets/img/character/walk/walk6.png",
  ];

  IMAGES_JUMPING = [
    "assets/img/character/jump/jump1.png",
    "assets/img/character/jump/jump2.png",
    "assets/img/character/jump/jump3.png",
    "assets/img/character/jump/jump4.png",
    "assets/img/character/jump/jump5.png",
    "assets/img/character/jump/jump6.png",
    "assets/img/character/jump/jump7.png",
  ];

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

  IMAGES_HURT = [
    "assets/img/character/hurt/hurt1.png",
    "assets/img/character/hurt/hurt2.png",
    "assets/img/character/hurt/hurt3.png",
    "assets/img/character/hurt/hurt4.png",
  ];

  world;
  constructor() {
    super();
    this.loadImage("assets/img/character/walk/walk1.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.applyGravity();
    this.animate();

    this.offset = {
      top: 75,
      left: 50,
      right: 110,
      bottom: 25,
    };
  }

  animate() {
    setInterval(() => {
      if (!this.isDeadCharacter) {
        if (
          this.world.keyboard.RIGHT &&
          this.x < this.world.level.level_end_x
        ) {
          this.moveRight();
          this.otherDirection = false;
        }
        if (this.world.keyboard.LEFT && this.x > 0) {
          this.moveLeft();
          this.otherDirection = true;
        }
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
          this.jump();
        }
        this.world.camera_x = -this.x + 100;
      }
    }, 1000 / 60);

    setInterval(() => {
      if (this.isDead()) {
        this.playDeathAnimation();
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
          this.playAnimation(this.IMAGES_WALKING);
        } else {
          this.img = this.imageCache[this.IMAGES_WALKING[0]];
        }
      }
    }, 130);
  }

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

  jump() {
    this.speedY = 19.5;
    this.isJumping = true;
    AudioHub.playOneSound(AudioHub.CHARACTERJUMP);
  }

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
