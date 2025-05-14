/**
 * Represents the game over screen displayed when the player loses.
 */
class GameOverScreen {
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
   * Callback to restart the game.
   * @type {Function}
   */
  restartCallback;

  /**
   * Callback to return to the main menu.
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
   * Definition of the "Restart Game" button.
   * @type {object}
   */
  restartButton;

  /**
   * Definition of the "Back to Menu" button.
   * @type {object}
   */
  menuButton;

  /**
   * Bound `handleClick` method.
   * @private
   * @type {Function}
   */
  boundHandleClick;

  /**
   * Creates a new GameOverScreen instance.
   * @param {HTMLCanvasElement} canvas - The canvas element.
   * @param {Function} restartCallback - Callback to restart the game.
   * @param {Function} menuCallback - Callback to return to the menu.
   */
  constructor(canvas, restartCallback, menuCallback) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.restartCallback = restartCallback;
    this.menuCallback = menuCallback;
    this.width = canvas.width;
    this.height = canvas.height;
    this.backgroundImage = new Image();
    this.backgroundImage.src = "assets/img/ui/menu_bg.png";
    this.backgroundImageLoaded = false;
    this.restartButton = {
      x: this.width / 2 - 150,
      y: this.height / 2,
      width: 300,
      height: 50,
      text: "Restart Game",
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
   * Handles click or touch events.
   * @param {MouseEvent|TouchEvent} event - The event object.
   */
  handleClick(event) {
    const scaledClick = this.getScaledClickCoordinates(event);
    const clickX = scaledClick.x;
    const clickY = scaledClick.y;

    if (this.isPointInside(clickX, clickY, this.restartButton)) {
      this.removeEventListeners();
      this.restartCallback();
    } else if (this.isPointInside(clickX, clickY, this.menuButton)) {
      this.removeEventListeners();
      this.menuCallback();
    }
  }

  /**
   * Checks if a point is inside a rectangle.
   * @param {number} x - The x-coordinate of the point.
   * @param {number} y - The y-coordinate of the point.
   * @param {object} button - The rectangle object.
   * @returns {boolean} - True if the point is inside, false otherwise.
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
   * Clears the canvas and draws the game over screen.
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
   * Draws the "Game Over" text.
   */
  drawText() {
    this.ctx.font = "bold 64px OldLondon";
    this.ctx.fillStyle = "red";
    this.ctx.textAlign = "center";
    this.ctx.fillText("Game Over", this.width / 2, this.height / 4);
    this.ctx.shadowBlur = 0;
  }

  /**
   * Draws the restart and menu buttons.
   */
  drawButtons() {
    this.drawButton(this.restartButton);
    this.drawButton(this.menuButton);
  }

  /**
   * Draws a single button.
   * @param {object} button - The button object.
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
   * Makes the game over screen visible.
   */
  show() {
    this.addEventListeners();
    this.draw();
  }

  /**
   * Hides the game over screen.
   */
  hide() {
    this.removeEventListeners();
  }
}
