/**
 * Represents a screen that prompts the user to rotate their device
 * to landscape orientation.
 */
class WarningScreen {
  /**
   * The HTML canvas element.
   * @type {HTMLCanvasElement}
   */
  canvas;

  /**
   * The 2D rendering context.
   * @type {CanvasRenderingContext2D}
   */
  ctx;

  /**
   * Creates a new WarningScreen instance.
   * @param {HTMLCanvasElement} canvas - The canvas element.
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.draw();
  }

  /**
   * Draws the "rotate your device" message on the canvas.
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.font = "bold 32px sans-serif";
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(
      "Rotate your device",
      this.canvas.width / 2,
      this.canvas.height / 2,
    );
  }

  /**
   * Handles the resize event. Redraws the screen to keep the text centered.
   */
  handleResize() {
    this.draw();
  }

  /**
   * Shows the warning screen.
   */
  show() {
    this.draw();
  }
}
