class Cloud extends GameObject {
  y = -50;
  width = 740;
  height = 200;

  constructor() {
    super();
    this.loadImage("assets/img/clouds/clouds2.png");

    this.x = -50 + Math.random() * 500;
  }
}
