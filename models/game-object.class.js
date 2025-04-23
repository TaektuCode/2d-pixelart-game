class GameObject {
  x = 120;
  y = 250;
  img;
  width = 150;
  height = 200;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  moveRight() {
    console.log("Moving right");
  }

  moveLeft() {
    console.log("Moving left");
  }
}
