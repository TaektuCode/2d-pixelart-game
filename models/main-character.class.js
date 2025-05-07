class MainCharacter extends GameObject {
  y = 330;
  speed = 5.2;
  isJumping = false;
  isDeadCharacter = false;
  deathAnimationInterval;

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
      top: 75, //Die Kollisionsbox beginnt x Pixel unterhalb der oberen Bildgrenze
      left: 50, //Die Kollisionsbox beginnt x Pixel rechts der linken Bildgrenze
      right: 110, //Die Kollisionsbox endet x Pixel links der rechten Bildgrenze
      bottom: 25, //Die Kollisionsbox endet x Pixel oberhalb der unteren Bildgrenze
    };
  }

  animate() {
    setInterval(() => {
      if (!this.isDeadCharacter) {
        // Nur bewegen, wenn der Charakter nicht tot ist
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
        this.playDeathAnimation(); // Rufe die spezielle Dead-Animation auf
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else {
        // Wenn nicht in der Luft, nicht verletzt und nicht tot:
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
          this.playAnimation(this.IMAGES_WALKING);
        } else {
          // Wenn keine Bewegung, zeige das erste Walking-Bild
          this.img = this.imageCache[this.IMAGES_WALKING[0]];
        }
      }
    }, 130);
  }

  playDeathAnimation() {
    if (!this.isDeadCharacter) {
      this.isDeadCharacter = true; // Setze den Todeszustand nur einmal
      let i = 0;
      this.deathAnimationInterval = setInterval(() => {
        this.img = this.imageCache[this.IMAGES_DEAD[i]];
        i++;
        if (i >= this.IMAGES_DEAD.length) {
          clearInterval(this.deathAnimationInterval);
          // Optional: Hier das letzte Bild anzeigen lassen, falls gewünscht
          // this.img = this.imageCache[this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]];
        }
      }, 130);
    }
  }

  jump() {
    this.speedY = 19.5;
    this.isJumping = true;
  }
}
