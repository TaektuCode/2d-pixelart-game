class Endboss extends GameObject {
  y = 200;
  width = 400;
  height = 350;
  IMAGES_WALKING = [
    "assets/img/endboss/walk/Walk1_flip.png",
    "assets/img/endboss/walk/Walk2_flip.png",
    "assets/img/endboss/walk/Walk3_flip.png",
    "assets/img/endboss/walk/Walk4_flip.png",
    "assets/img/endboss/walk/Walk5_flip.png",
    "assets/img/endboss/walk/Walk6_flip.png",
  ];

  constructor() {
    super();
    this.loadImage("assets/img/endboss/walk/Walk1_flip.png");
    this.loadImages(this.IMAGES_WALKING);
    this.x = 700;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 200);
  }
}
