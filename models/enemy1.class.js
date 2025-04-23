class Enemy1 extends GameObject {
  width = 150;
  height = 100;
  y = 368;
  IMAGES_WALKING = [
    "assets/img/enemy1/walk/Walk1_flip.png",
    "assets/img/enemy1/walk/Walk2_flip.png",
    "assets/img/enemy1/walk/Walk3_flip.png",
    "assets/img/enemy1/walk/Walk4_flip.png",
    "assets/img/enemy1/walk/Walk5_flip.png",
  ];

  constructor() {
    super();
    this.loadImage("assets/img/enemy1/walk/Walk1_flip.png");
    this.loadImages(this.IMAGES_WALKING);

    this.x = 200 + Math.random() * 500;
    this.speed = 0.15 + Math.random() * 0.5;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);
    setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 100);
  }
}
