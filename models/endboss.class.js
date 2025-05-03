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
  deathAnimationInterval; // Variable für das Todesanimations-Intervall
  deathAnimationFrame = 0;

  IMAGES_WALKING = [
    "assets/img/endboss/walk/Walk1_flip.png",
    "assets/img/endboss/walk/Walk2_flip.png",
    "assets/img/endboss/walk/Walk3_flip.png",
    "assets/img/endboss/walk/Walk4_flip.png",
    "assets/img/endboss/walk/Walk5_flip.png",
    "assets/img/endboss/walk/Walk6_flip.png",
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
    this.x = 2550;
    this.hp = 90;
    this.speed = 0.45;
    this.animate(); // Für Walking und Hurt
    this.startMovingLeft();

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
      // Die Todesanimation wird separat gesteuert
    }, 200);
  }

  animateDeath() {
    let i = 0;
    this.deathAnimationInterval = setInterval(() => {
      this.img = this.imageCache[this.IMAGES_DEAD[i % this.IMAGES_DEAD.length]];
      i++;
      if (i >= this.IMAGES_DEAD.length) {
        clearInterval(this.deathAnimationInterval);
        this.toBeRemoved = true; // Entferne den Boss nach der Animation
      }
    }, 215); // Langsamere Geschwindigkeit (500ms pro Frame)
  }

  startMovingLeft() {
    this.isMovingLeft = true;
    setInterval(() => {
      if (this.isMovingLeft) {
        this.moveLeft();
      }
    }, 1000 / 60);
  }

  hit(damage) {
    this.hp -= damage;
    this.isHitState = true;
    this.isMovingLeft = false;
    this.lastHitTime = Date.now();
    if (this.hp <= 0 && !this.isDead) {
      this.die();
    }
  }

  die() {
    this.isDead = true;
    this.isMovingLeft = false;
    this.isHitState = false;
    this.animateDeath(); // Starte die separate Todesanimation
  }

  removeFromWorld() {
    this.toBeRemoved = true;
  }
}
