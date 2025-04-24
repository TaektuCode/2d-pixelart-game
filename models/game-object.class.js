class GameObject extends DrawableObject {
  speed = 0.15;
  speedY = 0;
  velocity = 1;
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
    }, 1000 / 25);
  }

  isAboveGround() {
    return this.y < 325;
  }

  isColliding(go) {
    let thisLeft = this.x + this.offset.left;
    let thisRight = this.x + this.width - this.offset.right;
    let thisTop = this.y + this.offset.top;
    let thisBottom = this.y + this.height - this.offset.bottom;

    let goLeft = go.x + go.offset.left;
    let goRight = go.x + go.width - go.offset.right;
    let goTop = go.y + go.offset.top;
    let goBottom = go.y + go.height - go.offset.bottom;

    if (this.otherDirection) {
      let originalLeft = thisLeft;
      thisLeft = thisRight;
      thisRight = originalLeft;
    }

    return (
      thisRight > goLeft &&
      thisBottom > goTop &&
      thisLeft < goRight &&
      thisTop < goBottom
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
    let i = this.currentImage % images.length; // let i = 0 % 6
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
      // Wenn nach links geschaut wird, müssen wir die x-Koordinate anpassen
      x = this.x + this.offset.right; // Beginne vom linken Rand + dem ursprünglichen rechten Offset
    }

    ctx.strokeRect(
      x,
      this.y + this.offset.top,
      width,
      this.height - this.offset.top - this.offset.bottom,
    );
  }
}
