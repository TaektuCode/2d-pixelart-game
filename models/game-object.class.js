class GameObject {
  img;
  x = 120;
  y = 325;
  width = 200;
  height = 150;
  speed = 0.15;
  speedY = 0;
  velocity = 1;
  otherDirection = false;
  imageCache = {};
  currentImage = 0;
  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.velocity;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    return this.y < 325;
  }

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  isColliding(go) {
    return (
      this.x + this.width - this.offset.right > go.x + go.offset.left &&
      this.y + this.height - this.offset.bottom > go.y + go.offset.top &&
      this.x + this.offset.left < go.x + go.width - go.offset.right &&
      this.y + this.offset.top < go.y + go.height - go.offset.bottom
    );
  }

  /**
   *
   * @param {Array} arr - ["img/image1.png", "img/image2.png" ...]
   */

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  playAnimation(images) {
    let i = this.currentImage % this.IMAGES_WALKING.length; // let i = 0 % 6
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  jump() {
    this.speedY = 30;
  }

  drawCollisionBox(ctx) {
    ctx.strokeStyle = "lime"; // Ändere die Farbe zur besseren Unterscheidung
    ctx.lineWidth = 3;
    ctx.strokeRect(
      this.x + this.offset.left,
      this.y + this.offset.top,
      this.width - this.offset.left - this.offset.right,
      this.height - this.offset.top - this.offset.bottom,
    );
  }
}
