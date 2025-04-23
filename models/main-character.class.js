class MainCharacter extends GameObject {
  y = 80;
  speed = 10;

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

  world;
  constructor() {
    super();
    this.loadImage("assets/img/character/walk/walk1.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
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
      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
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
    }, 1000 / 60);

    setInterval(() => {
      if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
          this.playAnimation(this.IMAGES_WALKING);
        }
      }
    }, 50);
  }

  jump() {
    this.speedY = 16.5;
  }
}
