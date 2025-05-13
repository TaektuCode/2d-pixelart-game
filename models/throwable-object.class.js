class ThrowableObject extends GameObject {
  accelerationY = -1.5;
  isFalling = true;
  throwInterval;
  isRemoved = false;
  startY;

  constructor(x, y, characterOtherDirection) {
    super(x, y);
    this.loadImage("assets/img/character/attack/stone.png");
    this.x = x - 30;
    this.y = y;
    this.startY = y;
    this.width = 60;
    this.height = 60;
    this.speedY = 20;
    this.direction = characterOtherDirection ? -1 : 1;

    this.offset = { top: 15, left: 15, right: 15, bottom: 15 };

    this.throw();
  }

  throw() {
    AudioHub.playOneSound(AudioHub.THROWSTONE);
    this.throwInterval = setInterval(() => {
      this.x += 10 * this.direction;

      if (this.isFalling) {
        this.y -= this.speedY;
        this.speedY += this.accelerationY;

        if (this.speedY < -35 && this.y > 350) {
          this.remove();
        }
      }
    }, 50);
  }

  remove() {
    this.isRemoved = true;
    clearInterval(this.throwInterval);
  }

  isColliding(otherObject) {
    return super.isColliding(otherObject);
  }
}
