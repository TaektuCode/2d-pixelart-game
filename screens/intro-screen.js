/**
 * Represents the introductory story screen of the game.
 */
class IntroScreen {
  /**
   * The canvas element on which the intro screen is rendered.
   * @type {HTMLCanvasElement}
   */
  canvas;

  /**
   * The 2D rendering context of the canvas.
   * @type {CanvasRenderingContext2D}
   */
  ctx;

  /**
   * Callback function to be executed when the intro screen is finished and the game should proceed.
   * @type {Function}
   */
  onContinueCallback;

  /**
   * The background image for the intro screen.
   * @type {HTMLImageElement}
   */
  backgroundImage;

  /**
   * A flag indicating whether the background image has loaded.
   * @type {boolean}
   */
  backgroundImageLoaded;

  /**
   * The bound `handleClick` method to maintain the `this` context.
   * @private
   * @type {Function}
   */
  boundHandleClick;

  /**
   * Creates a new IntroScreen instance.
   * @param {HTMLCanvasElement} canvas - The canvas element on which the intro screen will be rendered.
   * @param {Function} onContinueCallback - Callback function to be executed when the intro screen is finished.
   */
  constructor(canvas, onContinueCallback) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.onContinueCallback = onContinueCallback;
    this.backgroundImage = new Image();
    this.backgroundImage.src = "assets/img/ui/menu_bg.png";
    this.backgroundImageLoaded = false;

    this.backgroundImage.onload = () => {
      this.backgroundImageLoaded = true;
      this.draw();
    };

    this.addEventListeners();
    this.draw(); // Initial draw
  }

  /**
   * Redraws the screen when the window is resized to adjust text positions.
   */
  handleResize() {
    this.draw(); // Redraw on resize to adjust text positions
  }

  /**
   * Adds event listeners for 'click' and 'touchstart' events to the canvas for handling user interaction.
   */
  addEventListeners() {
    this.boundHandleClick = this.handleClick.bind(this);
    this.canvas.addEventListener("click", this.boundHandleClick);
    this.canvas.addEventListener("touchstart", this.boundHandleClick); // For touch input
  }

  /**
   * Removes the 'click' and 'touchstart' event listeners from the canvas.
   */
  removeEventListeners() {
    this.canvas.removeEventListener("click", this.boundHandleClick);
    this.canvas.removeEventListener("touchstart", this.boundHandleClick);
  }

  /**
   * Makes the intro screen visible and active by adding event listeners and drawing it.
   */
  show() {
    this.addEventListeners();
    this.draw();
  }

  /**
   * Draws the introductory story screen on the canvas. This includes the background image and the story text.
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.backgroundImageLoaded) {
      this.ctx.drawImage(
        this.backgroundImage,
        0,
        0,
        this.canvas.width,
        this.canvas.height,
      );
      this.ctx.fillStyle = "white";
      this.ctx.font = `52px OldLondon`;
      this.ctx.textAlign = "center";
      this.ctx.fillText("Story", this.canvas.width / 2, 100);

      this.ctx.font = `28px OldLondon`;
      const text =
        "The evil Orc Toran casts a dark shadow. Small rogue Flicker, despite his size, is the only hope to defeat him and save the land.";
      const maxWidth = this.canvas.width * 0.8; // 80% of the canvas width
      const lineHeight = 30;
      const textY = 200;

      this.wrapText(
        this.ctx,
        text,
        this.canvas.width / 2,
        textY,
        maxWidth,
        lineHeight,
      );

      this.ctx.font = `bold 24px serif`;
      this.ctx.fillText(
        "PRESS ON SCREEN",
        this.canvas.width / 2,
        this.canvas.height * 0.8,
      ); // Position relative to the height
    } else {
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = "white";
      this.ctx.font = "20px sans-serif";
      this.ctx.textAlign = "center";
      this.ctx.fillText(
        "Loading...",
        this.canvas.width / 2,
        this.canvas.height / 2,
      );
    }
  }

  /**
   * Handles click or touch events on the intro screen. When triggered, it plays the start screen music,
   * executes the `onContinueCallback` to proceed to the next screen, and removes the event listeners.
   */
  handleClick() {
    AudioHub.playLoopingSound(AudioHub.STARTSCREEN_MUSIC);
    this.onContinueCallback(); // Switch to StartScreen
    this.removeEventListeners();
  }

  /**
   * Wraps text to fit within a specified width on the canvas.
   * @param {CanvasRenderingContext2D} context - The 2D rendering context.
   * @param {string} text - The text to wrap.
   * @param {number} x - The starting x-coordinate for the text.
   * @param {number} y - The starting y-coordinate for the text.
   * @param {number} maxWidth - The maximum width of a line of text.
   * @param {number} lineHeight - The height of each line of text.
   */
  wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    let testLine = "";
    let metrics = null;

    for (let i = 0; i < words.length; i++) {
      testLine += words[i] + " ";
      metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && i > 0) {
        context.fillText(line, x, y);
        line = words[i] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
      testLine = line;
    }
    context.fillText(line, x, y);
  }
}
