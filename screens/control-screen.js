/**
 * Represents the screen for game controls.
 */
class ControlScreen {
  /**
   * The canvas element.
   * @type {HTMLCanvasElement}
   */
  canvas;

  /**
   * The 2D rendering context.
   * @type {CanvasRenderingContext2D}
   */
  ctx;

  /**
   * Callback to return to the start screen.
   * @type {Function}
   */
  showStartScreenCallback;

  /**
   * Callback to start the game.
   * @type {Function}
   */
  startGameCallback;

  /**
   * The background image.
   * @type {HTMLImageElement}
   */
  backgroundImage;

  /**
   * Flag indicating if the background image is loaded.
   * @type {boolean}
   */
  backgroundImageLoaded;

  /**
   * Definition of the "Back" button.
   * @type {object}
   */
  backButton;

  /**
   * Definition of the "Start Game" button.
   * @type {object}
   */
  startGameButton;

  /**
   * Bound `handleClick` method.
   * @private
   * @type {Function}
   */
  boundHandleClick;

  /**
   * Creates a new ControlScreen instance.
   * @param {HTMLCanvasElement} canvas - The canvas element.
   * @param {Function} showStartScreenCallback - Callback to return to start.
   * @param {Function} startGameCallback - Callback to start the game.
   */
  constructor(canvas, showStartScreenCallback, startGameCallback) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.showStartScreenCallback = showStartScreenCallback;
    this.startGameCallback = startGameCallback;
    this.backgroundImage = new Image();
    this.backgroundImage.src = "assets/img/ui/menu_bg.png";
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
   * Adjusts button positions on resize.
   */
  handleResize() {
    this.draw();
  }

  /**
   * Binds the handleClick method.
   */
  setBindings() {
    this.boundHandleClick = this.handleClick.bind(this);
  }

  /**
   * Adds event listeners.
   */
  addEventListeners() {
    this.canvas.addEventListener("click", this.boundHandleClick);
    this.canvas.addEventListener("touchstart", this.boundHandleClick);
  }

  /**
   * Removes event listeners.
   */
  removeEventListeners() {
    this.canvas.removeEventListener("click", this.boundHandleClick);
    this.canvas.removeEventListener("touchstart", this.boundHandleClick);
  }

  /**
   * Shows the control screen.
   */
  show() {
    this.removeEventListeners();
    this.addEventListeners();
    this.draw();
  }

  /**
   * Draws the control screen.
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
      this.drawButtonsAndText();
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
   * Draws buttons and control text.
   */
  drawButtonsAndText() {
    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonSpacing = 20;
    const startX = (this.canvas.width - (2 * buttonWidth + buttonSpacing)) / 2;
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
  }

  /**
   * Draws a single button.
   * @param {object} button - The button object.
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
   * Draws the control text.
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
   * Calculates the scaled click coordinates.
   * @param {MouseEvent|TouchEvent} event - The event object.
   * @returns {object} - Scaled click coordinates (x, y).
   */
  getScaledClickCoordinates(event) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    let clickX, clickY;

    if (event.type === "touchstart") {
      clickX = (event.touches[0].clientX - rect.left) * scaleX;
      clickY = (event.touches[0].clientY - rect.top) * scaleY;
      event.preventDefault();
    } else {
      clickX = (event.clientX - rect.left) * scaleX;
      clickY = (event.clientY - rect.top) * scaleY;
    }
    return { x: clickX, y: clickY };
  }

  /**
   * Handles click and touch events.
   * @param {MouseEvent|TouchEvent} event - The event object.
   */
  handleClick(event) {
    const scaledClick = this.getScaledClickCoordinates(event);
    const clickX = scaledClick.x;
    const clickY = scaledClick.y;

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
   * Checks if a point is inside a rectangle.
   * @param {number} x - The x-coordinate of the point.
   * @param {number} y - The y-coordinate of the point.
   * @param {object} rect - The rectangle object.
   * @returns {boolean} - True if the point is inside, false otherwise.
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
