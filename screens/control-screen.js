/**
 * Represents the screen for game controls.
 */
class ControlScreen {
  /**
   * The canvas element on which the screen is rendered.
   * @type {HTMLCanvasElement}
   */
  canvas;

  /**
   * The 2D rendering context of the canvas.
   * @type {CanvasRenderingContext2D}
   */
  ctx;

  /**
   * Callback function that is called to return to the start screen.
   * @type {Function}
   */
  showStartScreenCallback;

  /**
   * Callback to start the game.
   * @type {Function}
   */
  startGameCallback;

  /**
   * The background image for the control screen.
   * @type {HTMLImageElement}
   */
  backgroundImage;

  /**
   * A flag indicating whether the background image has loaded.
   * @type {boolean}
   */
  backgroundImageLoaded;

  /**
   * Definition of the "Back" button.
   * @type {object}
   * @property {number} x - The x-coordinate of the button.
   * @property {number} y - The y-coordinate of the button.
   * @property {number} width - The width of the button.
   * @property {number} height - The height of the button.
   * @property {string} label - The label of the button.
   */
  backButton;

  /**
   * Definition of the "Start Game" button.
   * @type {object}
   * @property {number} x - The x-coordinate of the button.
   * @property {number} y - The y-coordinate of the button.
   * @property {number} width - The width of the button.
   * @property {number} height - The height of the button.
   * @property {string} label - The label of the button.
   */
  startGameButton;

  /**
   * The bound `handleClick` method to maintain the `this` context.
   * @private
   * @type {Function}
   */
  boundHandleClick;

  /**
   * Creates a new ControlScreen instance.
   * @param {HTMLCanvasElement} canvas - The canvas element on which the screen is rendered.
   * @param {Function} showStartScreenCallback - Callback function that is called to return to the start screen.
   * @param {Function} startGameCallback - Callback to start the game.
   */
  constructor(canvas, showStartScreenCallback, startGameCallback) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.showStartScreenCallback = showStartScreenCallback;
    this.startGameCallback = startGameCallback; // Store the startGameCallback
    this.backgroundImage = new Image();
    this.backgroundImage.src = "assets/img/ui/menu_bg.png"; // Path to the background image
    this.backgroundImageLoaded = false;
    this.backButton = { x: 0, y: 0, width: 0, height: 0, label: "Back" };
    this.startGameButton = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      label: "Start Game",
    };
    this.setBindings();
    this.addEventListeners();

    this.backgroundImage.onload = () => {
      this.backgroundImageLoaded = true;
      this.draw();
    };
    this.draw();
  }

  /**
   * Redraws the screen when the window is resized to adjust button positions and text.
   */
  handleResize() {
    this.draw(); // Redraw on resize to adjust button positions and text
  }

  /**
   * Binds the `handleClick` method to the current instance to ensure `this` is referenced correctly.
   */
  setBindings() {
    this.boundHandleClick = this.handleClick.bind(this);
  }

  /**
   * Adds event listeners for clicks and touch inputs to the canvas.
   */
  addEventListeners() {
    this.canvas.addEventListener("click", this.boundHandleClick);
    this.canvas.addEventListener("touchstart", this.boundHandleClick); // For touch input
  }

  /**
   * Removes the event listeners for clicks and touch inputs from the canvas.
   */
  removeEventListeners() {
    this.canvas.removeEventListener("click", this.boundHandleClick);
    this.canvas.removeEventListener("touchstart", this.boundHandleClick);
  }

  /**
   * Shows the control screen by restoring the event listeners and drawing the screen.
   */
  show() {
    this.removeEventListeners();
    this.addEventListeners();
    this.draw();
  }

  /**
   * Draws the control screen on the canvas. This includes the background image, buttons, and control text.
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
      const buttonWidth = 200;
      const buttonHeight = 50;
      const buttonSpacing = 20;

      // Calculate the starting position for the buttons to center them horizontally
      const totalButtonWidth = 2 * buttonWidth + buttonSpacing;
      const startX = (this.canvas.width - totalButtonWidth) / 2;
      const buttonY = this.canvas.height - buttonHeight - 75;

      this.backButton = {
        label: "Back",
        x: startX,
        y: buttonY,
        width: buttonWidth,
        height: buttonHeight,
      };
      this.startGameButton = {
        label: "Start Game",
        x: startX + buttonWidth + buttonSpacing,
        y: buttonY,
        width: buttonWidth,
        height: buttonHeight,
      };
      this.drawButton(this.backButton);
      this.drawButton(this.startGameButton);
      this.drawControlsText();
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
   * Draws a single button on the canvas.
   * @param {object} button - The button object with its properties (x, y, width, height, label).
   */
  drawButton(button) {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.fillRect(button.x, button.y, button.width, button.height);
    this.ctx.font = "24px sans-serif";
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      button.label,
      button.x + button.width / 2,
      button.y + button.height / 2,
    );
  }

  /**
   * Draws the text explaining the game controls on the canvas.
   */
  drawControlsText() {
    this.ctx.fillStyle = "white";
    this.ctx.font = "20px sans-serif";
    this.ctx.textAlign = "center";

    const textLines = [
      "Use the following keys to control the game:",
      "",
      "",
      "Arrow Keys: Move your character",
      "Spacebar: Jump",
      "D: Attack",
    ];

    const startX = this.canvas.width / 2;
    let startY = this.canvas.height / 2 - (textLines.length * 30) / 2 - 50;
    const lineHeight = 30;

    textLines.forEach((line) => {
      this.ctx.fillText(line, startX, startY);
      startY += lineHeight;
    });
  }

  /**
   * Handles click and touch events on the canvas. Checks if the click is within a button and performs the corresponding action.
   * @param {MouseEvent|TouchEvent} event - The triggered mouse or touch event.
   */
  handleClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    let clickX = event.clientX - rect.left; // Use let
    let clickY = event.clientY - rect.top; // Use let

    if (event.type === "touchstart") {
      const touch = event.changedTouches[0];
      clickX = touch.clientX - rect.left;
      clickY = touch.clientY - rect.top + 75;
      event.preventDefault();
    }

    if (this.isPointInside(clickX, clickY, this.backButton)) {
      this.removeEventListeners();
      this.showStartScreenCallback();
    } else if (this.isPointInside(clickX, clickY, this.startGameButton)) {
      this.removeEventListeners();
      AudioHub.stopStartScreenMusic();
      this.startGameCallback();
    }
  }

  /**
   * Checks if a given point is inside a rectangle.
   * @param {number} x - The x-coordinate of the point.
   * @param {number} y - The y-coordinate of the point.
   * @param {object} rect - The rectangle object with properties x, y, width, and height.
   * @returns {boolean} True if the point is inside the rectangle, false otherwise.
   */
  isPointInside(x, y, rect) {
    return (
      x >= rect.x &&
      x <= rect.x + rect.width &&
      y >= rect.y &&
      y <= rect.y + rect.height
    );
  }
}
