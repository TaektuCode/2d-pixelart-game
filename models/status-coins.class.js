/**
 * @file Defines the StatusCoins class, which represents the visual display
 * for the number of coins collected by the player. It extends the
 * DrawableObject class and handles drawing the coin icon and the collected count.
 */

/**
 * Represents the status display for the number of collected coins.
 * Extends the {@link DrawableObject} class.
 */
class StatusCoins extends DrawableObject {
  /**
   * The number of coins collected by the player.
   * @type {number}
   */
  collectedCoins = 0;
  /**
   * Array containing the path to the coin image.
   * @type {string[]}
   */
  IMAGE_COIN = ["assets/img/collectables/coin1.png"];

  /**
   * Creates a new StatusCoins instance.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGE_COIN);
    this.x = 20;
    this.y = 90;
    this.width = 30;
    this.height = 30;
  }

  /**
   * Increases the count of collected coins and plays the collect coin sound.
   */
  increaseCoinCount() {
    this.collectedCoins++;
    AudioHub.playOneSound(AudioHub.COLLECTCOIN);
  }

  /**
   * Draws the coin status display, including the count and the coin icon.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
   */
  draw(ctx) {
    if (this.imageCache[this.IMAGE_COIN[0]]) {
      this.drawCoinCountText(ctx);
      this.drawCoinIcon(ctx);
    }
  }

  /**
   * Draws the text displaying the number of collected coins.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
   */
  drawCoinCountText(ctx) {
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "white";
    ctx.fillText(
      `${this.collectedCoins}   x`,
      this.x,
      this.y + this.height / 2 + 5,
    );
  }

  /**
   * Draws the icon representing a coin.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
   */
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
