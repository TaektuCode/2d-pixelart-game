class GameObject extends DrawableObject {
  speed = 0.15;
  speedY = 0;
  velocity = 1.75;
  otherDirection = false;
  hp = 100;
  lastHit = 0;
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
      if (!this.isAboveGround() && this.speedY < 0) {
        this.y = 330;
        this.speedY = 0;
      }
    }, 1000 / 20);
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return this.y < 500;
    }
    return this.y < 325;
  }

  isColliding(go) {
    let charLeft = this.x + this.offset.left;
    let charRight = this.x + this.width - this.offset.right;
    let charTop = this.y + this.offset.top;
    let charBottom = this.y + this.height - this.offset.bottom;
    let goLeft = go.x + go.offset.left;
    let goRight = go.x + go.width - go.offset.right;
    let goTop = go.y + go.offset.top;
    let goBottom = go.y + go.height - go.offset.bottom;
    return (
      charRight > goLeft &&
      charBottom > goTop &&
      charLeft < goRight &&
      charTop < goBottom
    );
  }

  hit() {
    this.hp -= 5;
    if (this.hp <= 0) {
      this.hp = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  isDead() {
    return this.hp == 0;
  }

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  jump() {
    this.speedY = 30;
  }

  drawCollisionBox(ctx) {
    ctx.strokeStyle = "lime";
    ctx.lineWidth = 3;
    let x = this.x + this.offset.left;
    let width = this.width - this.offset.left - this.offset.right;

    if (this.otherDirection) {
      x = this.x + this.offset.right;
    }

    ctx.strokeRect(
      x,
      this.y + this.offset.top,
      width,
      this.height - this.offset.top - this.offset.bottom,
    );
  }
}
