/**
 * @file Defines the StatusBarCollectables class, which represents the visual
 * status bar for displaying the number of collected items (e.g., coins) in the game.
 * It extends the DrawableObject class and handles drawing the background bar,
 * icons for collected items, and the numerical count.
 */

/**
 * Represents the status bar for displaying the count of collected items.
 * Extends the {@link DrawableObject} class.
 */
class StatusBarCollectables extends DrawableObject {
  /**
   * Array containing the path to the background bar image.
   * @type {string[]}
   */
  IMAGE_BAR = ["assets/img/statusbars/health/hp_bar_full.png"];
  /**
   * Array containing the path to the icon image representing a collected item.
   * @type {string[]}
   */
  IMAGE_POINT = ["assets/img/statusbars/attacks/magic_point.png"];
  /**
   * The current count of collected items.
   * @type {number}
   */
  collectableCount = 0;

  /**
   * Creates a new StatusBarCollectables instance.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGE_BAR);
    this.loadImages(this.IMAGE_POINT);
    this.setCollectableCount(0);
    this.x = 10;
    this.y = 50;
    this.width = 200;
    this.height = 30;
  }

  /**
   * Sets the current count of collected items.
   * @param {number} count - The new count of collected items.
   */
  setCollectableCount(count) {
    this.collectableCount = count;
  }

  /**
   * Draws the status bar, including the background, icons, and the numerical count.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
   */
  draw(ctx) {
    this.drawBackgroundBar(ctx);
    this.drawCollectableIcons(ctx);
    this.drawCollectableCount(ctx);
  }

  /**
   * Draws the background bar of the status bar.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
   */
  drawBackgroundBar(ctx) {
    if (this.imageCache[this.IMAGE_BAR[0]]) {
      ctx.drawImage(
        this.imageCache[this.IMAGE_BAR[0]],
        this.x,
        this.y,
        this.width,
        this.height,
      );
    }
  }

  /**
   * Draws the icons representing the collected items. Limits the number of icons displayed.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
   */
  drawCollectableIcons(ctx) {
    if (this.imageCache[this.IMAGE_POINT[0]]) {
      const iconWidth = 25;
      const iconHeight = 15;
      const spacing = 3;
      const startX = this.x + 17;
      const startY = this.y + (this.height - iconHeight) / 2;
      const maxPointsToShow = 6;
      this.renderCollectableIcons(
        ctx,
        startX,
        startY,
        iconWidth,
        iconHeight,
        spacing,
        maxPointsToShow,
      );
    }
  }

  /**
   * Renders the individual icons for the collected items.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
   * @param {number} startX - The starting x-coordinate for the first icon.
   * @param {number} startY - The starting y-coordinate for the icons.
   * @param {number} iconWidth - The width of each icon.
   * @param {number} iconHeight - The height of each icon.
   * @param {number} spacing - The horizontal space between icons.
   * @param {number} maxPointsToShow - The maximum number of icons to display.
   */
  renderCollectableIcons(
    ctx,
    startX,
    startY,
    iconWidth,
    iconHeight,
    spacing,
    maxPointsToShow,
  ) {
    for (let i = 0; i < Math.min(this.collectableCount, maxPointsToShow); i++) {
      const iconX = startX + i * (iconWidth + spacing);
      ctx.drawImage(
        this.imageCache[this.IMAGE_POINT[0]],
        iconX,
        startY,
        iconWidth,
        iconHeight,
      );
    }
  }

  /**
   * Draws the numerical count of the collected items.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
   */
  drawCollectableCount(ctx) {
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "white";
    ctx.textAlign = "right";
    ctx.fillText(
      `${this.collectableCount}`,
      this.x + this.width - 25,
      this.y + 20,
    );
    ctx.textAlign = "start";
  }
}
