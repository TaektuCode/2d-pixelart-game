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
   * Definition of the "Control" button (visual).
   * @type {object}
   */
  startButtonVisual;

  /**
   * Definition of the "Control" button (logic).
   * @type {object}
   */
  startButtonLogic;

  /**
   * Definition of the "Start Game" button (visual).
   * @type {object}
   */
  controlsButtonVisual;

  /**
   * Definition of the "Start Game" button (logic).
   * @type {object}
   */
  controlsButtonLogic;

  /**
   * Definition of the "Imprint" button (visual).
   * @type {object}
   */
  imprintButtonVisual;

  /**
   * Definition of the "Imprint" button (logic).
   * @type {object}
   */
  imprintButtonLogic;

  /**
   * The bound `handleClick` method.
   * @private
   * @type {Function}
   */
  boundHandleClick;

  /**
   * Creates a new StartScreen instance.
   * @param {HTMLCanvasElement} canvas - The canvas element.
   * @param {Function} startGameCallback - Callback to start the game.
   * @param {Function} showControlsCallback - Callback to show controls.
   */
  constructor(canvas, startGameCallback, showControlsCallback) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.startGameCallback = startGameCallback;
    this.showControlsCallback = showControlsCallback;
    this.backgroundImage = new Image();
    this.backgroundImage.src = "assets/img/ui/menu_bg.png";
    this.backgroundImageLoaded = false;

    this.startButtonVisual = {
      label: "Control",
      x: canvas.width / 2 - 110,
      y: canvas.height / 2 - 75,
      width: 200,
      height: 50,
    };
    this.controlsButtonVisual = {
      label: "Start Game",
      x: canvas.width / 2 - 110,
      y: canvas.height / 2,
      width: 200,
      height: 50,
    };
    this.imprintButtonVisual = {
      label: "Imprint",
      x: 25,
      y: 75,
      width: 80,
      height: 30,
    };

    this.startButtonLogic = { ...this.startButtonVisual };
    this.controlsButtonLogic = { ...this.controlsButtonVisual };
    this.imprintButtonLogic = { ...this.imprintButtonVisual };

    this.setBindings();
    this.addEventListeners();
    this.backgroundImage.onload = () => {
      this.backgroundImageLoaded = true;
      this.draw();
    };
    this.handleResize();
  }

  /**
   * Adjusts button positions on resize.
   */
  handleResize() {
    this.startButtonVisual.x = this.canvas.width / 2 - 110;
    this.startButtonVisual.y = this.canvas.height / 2 - 100;
    this.controlsButtonVisual.x = this.canvas.width / 2 - 110;
    this.controlsButtonVisual.y = this.canvas.height / 2;
    this.imprintButtonVisual.x = 25;
    this.imprintButtonVisual.y = 25;
    this.updateLogicPositions();
    this.draw();
  }

  /**
   * Updates the logical button positions based on visual positions.
   */
  updateLogicPositions() {
    this.startButtonLogic = { ...this.startButtonVisual };
    this.controlsButtonLogic = { ...this.controlsButtonVisual };
    this.imprintButtonLogic = { ...this.imprintButtonVisual };
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
   * Shows the start screen.
   */
  show() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.addEventListeners();
    this.draw();
  }

  /**
   * Draws the start screen.
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
    this.drawButton(this.startButtonVisual);
    this.drawButton(this.controlsButtonVisual);
    this.drawButton(this.imprintButtonVisual);
  }

  /**
   * Draws a button.
   * @param {object} button - The button object.
   */
  drawButton(button) {
    this.ctx.lineWidth = 2;
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.fillRect(button.x, button.y, button.width, button.height);
    this.ctx.font =
      button === this.imprintButtonVisual
        ? "bold 14px sans-serif"
        : "24px sans-serif";
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
   * Handles click/touch events.
   * @param {MouseEvent|TouchEvent} event - The event object.
   */
  handleClick(event) {
    let clickX, clickY;
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    if (event.type === "touchstart") {
      clickX = (event.touches[0].clientX - rect.left) * scaleX;
      clickY = (event.touches[0].clientY - rect.top) * scaleY;
      event.preventDefault();
    } else {
      clickX = (event.clientX - rect.left) * scaleX;
      clickY = (event.clientY - rect.top) * scaleY;
    }

    console.log("Scaled Click X:", clickX, "Scaled Click Y:", clickY);
    console.log(
      "Controls Button (Logic) - X:",
      this.controlsButtonLogic.x,
      "Y:",
      this.controlsButtonLogic.y,
      "Width:",
      this.controlsButtonLogic.width,
      "Height:",
      this.controlsButtonLogic.height,
    );
    console.log(
      "Start Button (Logic) - X:",
      this.startButtonLogic.x,
      "Y:",
      this.startButtonLogic.y,
      "Width:",
      this.startButtonLogic.width,
      "Height:",
      this.startButtonLogic.height,
    );
    console.log(
      "Imprint Button (Logic) - X:",
      this.imprintButtonLogic.x,
      "Y:",
      this.imprintButtonLogic.y,
      "Width:",
      this.imprintButtonLogic.width,
      "Height:",
      this.imprintButtonLogic.height,
    );

    if (this.isPointInside(clickX, clickY, this.controlsButtonLogic)) {
      this.removeEventListeners();
      AudioHub.stopStartScreenMusic();
      this.startGameCallback();
    } else if (this.isPointInside(clickX, clickY, this.startButtonLogic)) {
      this.removeEventListeners();
      this.showControlsCallback();
    } else if (this.isPointInside(clickX, clickY, this.imprintButtonLogic)) {
      window.location.href = "imprint.html";
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
