/**
 * Represents the start screen of the game.
 */
class StartScreen {
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
   * Callback function that is called when the game should be started.
   * @type {Function}
   */
  startGameCallback;

  /**
   * Callback function that is called to show the controls screen.
   * @type {Function}
   */
  showControlsCallback;

  /**
   * The background image for the start screen.
   * @type {HTMLImageElement}
   */
  backgroundImage;

  /**
   * A flag indicating whether the background image has loaded.
   * @type {boolean}
   */
  backgroundImageLoaded;

  /**
   * Definition of the "Control" button.
   * @type {object}
   * @property {string} label - The text label of the button.
   * @property {number} x - The x-coordinate of the button.
   * @property {number} y - The y-coordinate of the button.
   * @property {number} width - The width of the button.
   * @property {number} height - The height of the button.
   */
  startButton;

  /**
   * Definition of the "Start Game" button.
   * @type {object}
   * @property {string} label - The text label of the button.
   * @property {number} x - The x-coordinate of the button.
   * @property {number} y - The y-coordinate of the button.
   * @property {number} width - The width of the button.
   * @property {number} height - The height of the button.
   */
  controlsButton;

  /**
   * Definition of the "Imprint" button.
   * @type {object}
   * @property {string} label - The text label of the button.
   * @property {number} x - The x-coordinate of the button.
   * @property {number} y - The y-coordinate of the button.
   * @property {number} width - The width of the button.
   * @property {number} height - The height of the button.
   */
  imprintButton;

  /**
   * The bound `handleClick` method to maintain the `this` context.
   * @private
   * @type {Function}
   */
  boundHandleClick;

  /**
   * Creates a new StartScreen instance.
   * @param {HTMLCanvasElement} canvas - The canvas element on which the screen is rendered.
   * @param {Function} startGameCallback - Callback function that is called when the game should be started.
   * @param {Function} showControlsCallback - Callback function that is called to show the controls screen.
   */
  constructor(canvas, startGameCallback, showControlsCallback) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.startGameCallback = startGameCallback;
    this.showControlsCallback = showControlsCallback;
    this.backgroundImage = new Image();
    this.backgroundImage.src = "assets/img/ui/menu_bg.png";
    this.backgroundImageLoaded = false;
    this.startButton = {
      // Top
      label: "Control",
      x: canvas.width / 2 - 110,
      y: canvas.height / 2 - 75,
      width: 200,
      height: 50,
    };
    this.controlsButton = {
      // Bottom
      label: "Start Game",
      x: canvas.width / 2 - 110,
      y: canvas.height / 2,
      width: 200,
      height: 50,
    };
    this.imprintButton = {
      label: "Imprint",
      x: 25,
      y: 75,
      width: 80,
      height: 30,
    };
    this.setBindings();
    this.addEventListeners();
    this.backgroundImage.onload = () => {
      this.backgroundImageLoaded = true;
      this.draw();
    };
    this.handleResize();
  }

  /**
   * Adjusts the positions of the buttons when the screen is resized.
   */
  handleResize() {
    this.startButton.x = this.canvas.width / 2 - 110;
    this.startButton.y = this.canvas.height / 2 - 100;
    this.controlsButton.x = this.canvas.width / 2 - 110;
    this.controlsButton.y = this.canvas.height / 2;
    (this.imprintButton.x = 25), (this.imprintButton.y = 25), this.draw();
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
    this.canvas.addEventListener("touchstart", this.boundHandleClick);
  }

  /**
   * Removes the 'click' and 'touchstart' event listeners from the canvas.
   */
  removeEventListeners() {
    this.canvas.removeEventListener("click", this.boundHandleClick);
    this.canvas.removeEventListener("touchstart", this.boundHandleClick);
  }

  /**
   * Clears the canvas and adds event listeners before drawing the start screen.
   */
  show() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.addEventListeners();
    this.draw();
  }

  /**
   * Clears the canvas and draws the background image and buttons for the start screen.
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.backgroundImageLoaded) {
      this.ctx.drawImage(
        this.backgroundImage,
        0,
        0,
        this.canvas.width,
        this.canvas.height,
      );
    }
    this.drawButton(this.startButton);
    this.drawButton(this.controlsButton);
    this.drawButton(this.imprintButton);
  }

  /**
   * Draws a single button on the canvas with a background and text.
   * @param {object} button - The button object with label, x, y, width, and height properties.
   */
  drawButton(button) {
    this.ctx.lineWidth = 2;

    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.fillRect(button.x, button.y, button.width, button.height);

    if (button === this.imprintButton) {
      this.ctx.font = "bold 14px sans-serif";
    } else {
      this.ctx.font = "24px sans-serif";
    }

    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(
      button.label,
      button.x + button.width / 2,
      button.y + button.height / 2,
    );
  }

  /**
   * Handles click or touch events on the start screen. It checks if the click/touch coordinates
   * are within the bounds of the "Start Game", "Control", or "Imprint" buttons and performs the
   * corresponding action.
   * @param {MouseEvent|TouchEvent} event - The mouse or touch event object.
   */
  handleClick(event) {
    let clickX, clickY;
    const rect = this.canvas.getBoundingClientRect();

    if (event.type === "touchstart") {
      clickX = event.touches[0].clientX - rect.left;
      clickY = event.touches[0].clientY - rect.top + 50;
      event.preventDefault();
    } else {
      clickX = event.clientX - rect.left;
      clickY = event.clientY - rect.top;
    }

    if (this.isPointInside(clickX, clickY, this.controlsButton)) {
      this.removeEventListeners();
      AudioHub.stopStartScreenMusic();
      this.startGameCallback();
    } else if (this.isPointInside(clickX, clickY, this.startButton)) {
      this.removeEventListeners();
      this.showControlsCallback();
    } else if (this.isPointInside(clickX, clickY, this.imprintButton)) {
      window.location.href = "imprint.html";
    }
  }

  /**
   * Checks if a given point (x, y) is inside a rectangle (button).
   * @param {number} x - The x-coordinate of the point.
   * @param {number} y - The y-coordinate of the point.
   * @param {object} rect - The rectangle object with x, y, width, and height properties.
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
