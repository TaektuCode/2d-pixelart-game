class Enemy1 extends GameObject {
  width = 150;
  height = 100;
  y = 368;
  constructor() {
    super();
    this.loadImage("assets/img/enemy1/walk/Walk1.png");

    this.x = 200 + Math.random() * 500;
  }
}
