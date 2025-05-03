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
    this.hp = 90;
    this.animate();

    this.offset = {
      top: 130, //Die Kollisionsbox beginnt x Pixel unterhalb der oberen Bildgrenze
      left: 185, //Die Kollisionsbox beginnt x Pixel rechts der linken Bildgrenze
      right: 90, //Die Kollisionsbox endet x Pixel links der rechten Bildgrenze
      bottom: 90, //Die Kollisionsbox endet x Pixel oberhalb der unteren Bildgrenze
    };
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 200);
  }

  hit(damage) {
    this.hp -= damage;
    if (this.hp < 0) {
      this.hp = 0;
    }
  }
}
