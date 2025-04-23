class Cloud extends GameObject {
  y = -50;
  width = 740;
  height = 400;

  constructor(imagePath, x) {
    super();
    this.loadImage(imagePath);

    this.x = x;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.x -= 0.15;
    }, 1000 / 60);
  }
}
