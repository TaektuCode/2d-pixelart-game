class Enemy1 extends GameObject {
  constructor() {
    super();
    this.loadImage("assets/img/enemy1/walk/Walk1.png");

    this.x = 200 + Math.random() * 500;
  }
}
