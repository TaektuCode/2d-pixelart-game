/**
 * Represents the win screen displayed when the player successfully completes the game.
 */
class WinScreen {
  /**
   * The HTML canvas element used for rendering the win screen.
   * @type {HTMLCanvasElement}
   */
  canvas;

  /**
   * The 2D rendering context of the canvas.
   * @type {CanvasRenderingContext2D}
   */
  ctx;

  /**
   * Callback function to restart the game.
   * @type {Function}
   */
  playAgainCallback;

  /**
   * Callback function to return to the main menu.
   * @type {Function}
   */
  menuCallback;

  /**
   * The width of the canvas.
   * @type {number}
   */
  width;

  /**
   * The height of the canvas.
   * @type {number}
   */
  height;

  /**
   * The background image for the win screen.
   * @type {HTMLImageElement}
   */
  backgroundImage;

  /**
   * A flag indicating whether the background image has loaded.
   * @type {boolean}
   */
  backgroundImageLoaded;

  /**
   * Definition of the "Play Again" button.
   * @type {object}
   * @property {number} x - The x-coordinate of the button.
   * @property {number} y - The y-coordinate of the button.
   * @property {number} width - The width of the button.
   * @property {number} height - The height of the button.
   * @property {string} text - The text label of the button.
   */
  playAgainButton;

  /**
   * Definition of the "Back to Menu" button.
   * @type {object}
   * @property {number} x - The x-coordinate of the button.
   * @property {number} y - The y-coordinate of the button.
   * @property {number} width - The width of the button.
   * @property {number} height - The height of the button.
   * @property {string} text - The text label of the button.
   */
  menuButton;

  /**
   * The bound `handleClick` method to maintain the `this` context.
   * @private
   * @type {Function}
   */
  boundHandleClick;

  /**
   * Creates a new WinScreen instance.
   * @param {HTMLCanvasElement} canvas - The canvas element on which the win screen will be rendered.
   * @param {Function} playAgainCallback - Callback function to be executed when the "Play Again" button is clicked.
   * @param {Function} menuCallback - Callback function to be executed when the "Back to Menu" button is clicked.
   */
  constructor(canvas, playAgainCallback, menuCallback) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.playAgainCallback = playAgainCallback;
    this.menuCallback = menuCallback;
    this.width = canvas.width;
    this.height = canvas.height;
    this.backgroundImage = new Image();
    this.backgroundImage.src = "assets/img/ui/menu_bg.png";
    this.backgroundImageLoaded = false;
    this.playAgainButton = {
      x: this.width / 2 - 150,
      y: this.height / 2,
      width: 300,
      height: 50,
      text: "Play Again",
    };
    this.menuButton = {
      x: this.width / 2 - 150,
      y: this.height / 2 + 60,
      width: 300,
      height: 50,
      text: "Back to Menu",
    };
    this.setBindings();
    this.addEventListeners();

    this.backgroundImage.onload = () => {
      this.backgroundImageLoaded = true;
      this.draw();
    };
  }

  /**
   * Binds the `handleClick` method to the current instance to ensure the `this` context is correct.
   */
  setBindings() {
    this.boundHandleClick = this.handleClick.bind(this);
  }

  /**
   * Adds event listeners for 'click' and 'touchstart' events to the canvas for handling user interaction.
   */
  addEventListeners() {
    this.canvas.addEventListener("click", this.boundHandleClick);
    this.canvas.addEventListener("touchstart", this.boundHandleClick); // For touch input
  }

  /**
   * Removes the 'click' and 'touchstart' event listeners from the canvas.
   */
  removeEventListeners() {
    this.canvas.removeEventListener("click", this.boundHandleClick);
    this.canvas.removeEventListener("touchstart", this.boundHandleClick); // Also remove touch listener
  }

  /**
   * Handles click or touch events on the win screen. It checks if the click/touch coordinates
   * are within the bounds of the "Play Again" or "Back to Menu" buttons and executes the
   * corresponding callback function.
   * @param {MouseEvent|TouchEvent} event - The mouse or touch event object.
   */
  handleClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    let x, y;

    if (event.type === "touchstart") {
      x = event.touches[0].clientX - rect.left;
      y = event.touches[0].clientY - rect.top + 50;
      event.preventDefault(); // Prevents potential unwanted scrolling/zooming
    } else {
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    }

    if (this.isPointInside(x, y, this.playAgainButton)) {
      this.removeEventListeners();
      this.playAgainCallback();
    } else if (this.isPointInside(x, y, this.menuButton)) {
      this.removeEventListeners();
      this.menuCallback();
    }
  }

  /**
   * Checks if a given point (x, y) is inside a button object.
   * @param {number} x - The x-coordinate of the point.
   * @param {number} y - The y-coordinate of the point.
   * @param {object} button - The button object with x, y, width, and height properties.
   * @returns {boolean} True if the point is inside the button, false otherwise.
   */
  isPointInside(x, y, button) {
    return (
      x > button.x &&
      x < button.x + button.width &&
      y > button.y &&
      y < button.y + button.height
    );
  }

  /**
   * Clears the canvas and draws the win screen elements, including the background, text, and buttons.
   */
  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.backgroundImageLoaded) {
      this.ctx.drawImage(this.backgroundImage, 0, 0, this.width, this.height);
    }
    this.drawText();

    this.drawButtons();
  }

  /**
   * Draws the "You Won!" text in the center of the screen.
   */
  drawText() {
    this.ctx.font = "bold 64px OldLondon";
    this.ctx.fillStyle = "green"; // Changed color to green for "You Won"
    this.ctx.textAlign = "center";
    this.ctx.fillText("You Won!", this.width / 2, this.height / 4); // Changed text
    this.ctx.shadowBlur = 0;
  }

  /**
   * Draws the "Play Again" and "Back to Menu" buttons on the screen.
   */
  drawButtons() {
    this.drawButton(this.playAgainButton);
    this.drawButton(this.menuButton);
  }

  /**
   * Draws a single button on the canvas with a background and text.
   * @param {object} button - The button object with x, y, width, height, and text properties.
   */
  drawButton(button) {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.fillRect(button.x, button.y, button.width, button.height);
    this.ctx.font = "bold 24px sans-serif";
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(
      button.text,
      button.x + button.width / 2,
      button.y + button.height / 2,
    );
  }

  /**
   * Makes the win screen visible and active by adding event listeners and drawing it.
   */
  show() {
    this.addEventListeners();
    this.draw();
  }

  /**
   * Hides the win screen by removing its event listeners.
   */
  hide() {
    this.removeEventListeners();
  }
}
