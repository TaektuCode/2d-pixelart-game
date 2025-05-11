class Enemy1 extends GameObject {
  width = 150;
  height = 100;
  y = 368;
  isDeadEnemy = false;
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

    this.offset = {
      top: 35, //Die Kollisionsbox beginnt x Pixel unterhalb der oberen Bildgrenze
      left: 35, //Die Kollisionsbox beginnt x Pixel rechts der linken Bildgrenze
      right: 10, //Die Kollisionsbox endet x Pixel links der rechten Bildgrenze
      bottom: 10, //Die Kollisionsbox endet x Pixel oberhalb der unteren Bildgrenze
    };
  }

  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);
    setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 100);
  }

  hit() {
    this.hp = 0; // Setze die HP sofort auf 0
    if (!this.isDeadEnemy) {
      AudioHub.playOneSound(AudioHub.ENEMY1DEAD);
      this.isDeadEnemy = true;
    }
  }

  isDead() {
    return this.hp <= 0;
  }
}
