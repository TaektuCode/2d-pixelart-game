/**
 * @file Defines the StatusBar class, which represents the visual status bar
 * for displaying the health of the main character. It extends the
 * DrawableObject class and handles drawing the background bar and health icons
 * based on the current health percentage.
 */

/**
 * Represents the status bar for the main character's health.
 * Extends the {@link DrawableObject} class.
 */
class StatusBar extends DrawableObject {
  /**
   * Array containing the path to the background bar image.
   * @type {string[]}
   */
  IMAGE_BAR = ["assets/img/statusbars/health/hp_bar_full.png"];
  /**
   * Array containing the path to the health point icon image.
   * @type {string[]}
   */
  IMAGE_HP = ["assets/img/statusbars/health/hp_point.png"];

  /**
   * The current health percentage of the character (0-100).
   * @type {number}
   */
  percentage = 100;

  /**
   * Creates a new StatusBar instance.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGE_BAR);
    this.loadImages(this.IMAGE_HP);
    this.setPercentage(100);
    this.x = 10;
    this.y = 5;
    this.width = 200;
    this.height = 40;
  }

  /**
   * Sets the current health percentage of the character.
   * @param {number} percentage - The new health percentage (0-100).
   */
  setPercentage(percentage) {
    this.percentage = percentage;
  }

  /**
   * Draws the health status bar, including the background and health icons.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
   */
  draw(ctx) {
    this.drawBarBackground(ctx);
    this.drawHpIcons(ctx);
  }

  /**
   * Draws the background bar of the health status bar.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
   */
  drawBarBackground(ctx) {
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
   * Draws the health point icons based on the current health percentage.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
   */
  drawHpIcons(ctx) {
    if (this.imageCache[this.IMAGE_HP[0]]) {
      const hpPointsToShow = this.calculateHpPointsToShow();
      const hpPointWidth = 12;
      const spacing = 5;
      const startX = this.x + 17;
      const startY = this.y + 10;
      this.renderHpIcons(
        ctx,
        startX,
        startY,
        hpPointWidth,
        spacing,
        hpPointsToShow,
      );
    }
  }

  /**
   * Calculates the number of health point icons to display based on the current percentage.
   * @returns {number} The number of health point icons to show.
   */
  calculateHpPointsToShow() {
    return Math.max(0, Math.ceil(this.percentage / 10));
  }

  /**
   * Renders the individual health point icons.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
   * @param {number} startX - The starting x-coordinate for the first icon.
   * @param {number} startY - The starting y-coordinate for the icons.
   * @param {number} hpPointWidth - The width of each health point icon.
   * @param {number} spacing - The horizontal space between icons.
   * @param {number} hpPointsToShow - The number of health point icons to display.
   */
  renderHpIcons(ctx, startX, startY, hpPointWidth, spacing, hpPointsToShow) {
    for (let i = 0; i < hpPointsToShow; i++) {
      const hpPointX = startX + i * (hpPointWidth + spacing);
      ctx.drawImage(
        this.imageCache[this.IMAGE_HP[0]],
        hpPointX,
        startY,
        hpPointWidth,
        20,
      );
    }
  }
}
