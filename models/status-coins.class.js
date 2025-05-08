class StatusCoins extends DrawableObject {
  collectedCoins = 0;
  IMAGE_COIN = ["assets/img/collectables/coin1.png"]; // Speichere den Pfad

  constructor() {
    super();
    this.loadImages(this.IMAGE_COIN); // Starte das Laden
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
      // Zeichne die Anzahl der gesammelten Coins
      ctx.font = "16px sans-serif";
      ctx.fillStyle = "white";
      ctx.fillText(
        `${this.collectedCoins}   x`,
        this.x,
        this.y + this.height / 2 + 5,
      );

      // Zeichne das Coin-Bild
      ctx.drawImage(
        this.imageCache[this.IMAGE_COIN[0]],
        this.x + this.width + 10,
        this.y,
        this.width,
        this.height,
      );
    }
  }
}
