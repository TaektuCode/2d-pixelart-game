class StatusCoins extends DrawableObject {
  collectedCoins = 0;
  IMAGE_COIN = ["assets/img/collectables/coin1.png"];

  constructor() {
    super();
    this.loadImages(this.IMAGE_COIN);
    this.x = 20;
    this.y = 90;
    this.width = 30;
    this.height = 30;
  }

  increaseCoinCount() {
    this.collectedCoins++;
    AudioHub.playOneSound(AudioHub.COLLECTCOIN);
  }

  draw(ctx) {
    if (this.imageCache[this.IMAGE_COIN[0]]) {
      this.drawCoinCountText(ctx);
      this.drawCoinIcon(ctx);
    }
  }

  drawCoinCountText(ctx) {
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "white";
    ctx.fillText(
      `${this.collectedCoins}   x`,
      this.x,
      this.y + this.height / 2 + 5,
    );
  }

  drawCoinIcon(ctx) {
    ctx.drawImage(
      this.imageCache[this.IMAGE_COIN[0]],
      this.x + this.width + 10,
      this.y,
      this.width,
      this.height,
    );
  }
}
