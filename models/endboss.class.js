class Endboss extends GameObject {
  y = 200;
  width = 400;
  height = 350;
  isDead = false;
  isMovingLeft = false;
  isHitState = false;
  lastHitTime = 0;
  hurtAnimationDuration = 500;
  toBeRemoved = false;
  deathAnimationInterval;
  deathAnimationFrame = 0;
  stepSoundDelay = 500;
  lastStepSoundTime = 0;

  IMAGES_WALKING = [
    "assets/img/endboss/walk/Walk1_flip.png",
    "assets/img/endboss/walk/Walk2_flip.png",
    "assets/img/endboss/walk/Walk3_flip.png",
    "assets/img/endboss/walk/Walk4_flip.png",
    "assets/img/endboss/walk/Walk5_flip.png",
    "assets/img/endboss/walk/Walk6_flip.png",
  ];

  IMAGES_ATTACK = [
    "assets/img/endboss/attack/Attack1_flip.png",
    "assets/img/endboss/attack/Attack2_flip.png",
    "assets/img/endboss/attack/Attack3_flip.png",
    "assets/img/endboss/attack/Attack4_flip.png",
  ];

  IMAGES_HURT = [
    "assets/img/endboss/hurt/Hurt1_flip.png",
    "assets/img/endboss/hurt/Hurt2_flip.png",
  ];

  IMAGES_DEAD = [
    "assets/img/endboss/death/Death1_flip.png",
    "assets/img/endboss/death/Death2_flip.png",
    "assets/img/endboss/death/Death3_flip.png",
    "assets/img/endboss/death/Death4_flip.png",
    "assets/img/endboss/death/Death5_flip.png",
    "assets/img/endboss/death/Death6_flip.png",
  ];

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

    this.offset = {
      top: 130,
      left: 185,
      right: 90,
      bottom: 90,
    };
  }

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

  hit(damage) {
    this.hp -= damage;
    this.isHitState = true;
    AudioHub.playOneSound(AudioHub.ENDBOSS_HURT);
    this.isMovingLeft = false;
    this.lastHitTime = Date.now();
    if (this.hp <= 0 && !this.isDead) {
      this.die();
    }
  }

  die() {
    this.isDead = true;
    AudioHub.playOneSound(AudioHub.ENDBOSS_DEATH);
    this.isMovingLeft = false;
    this.isHitState = false;
    this.animateDeath();
  }

  playAttackAnimation(callback) {
    let i = 0;
    const attackInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_ATTACK);
      i++;
      if (i >= this.IMAGES_ATTACK.length) {
        clearInterval(attackInterval);
        if (callback) {
          callback(); // Rufe die Callback-Funktion auf, nachdem die Animation beendet ist
        }
      }
    }, 200); // Geschwindigkeit der Attack-Animation
  }

  removeFromWorld() {
    this.toBeRemoved = true;
  }
}
