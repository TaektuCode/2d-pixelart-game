/**
 * Manages the different screens of the game, such as the intro screen, start screen,
 * controls screen, game over screen, and win screen. It handles switching between these screens
 * and ensures the active screen is drawn and responds to events.
 */
class ScreenManager {
  /**
   * The HTML canvas element used for rendering the game screens.
   * @type {HTMLCanvasElement}
   */
  canvas;

  /**
   * The 2D rendering context of the canvas.
   * @type {CanvasRenderingContext2D}
   */
  ctx;

  /**
   * Callback function to start the main game logic.
   * @type {Function}
   */
  startGameCallback;

  /**
   * Callback function to show the game over screen.
   * @type {Function}
   */
  showGameOverCallback;

  /**
   * Callback function to show the win screen.
   * @type {Function}
   */
  showWinScreenCallback;

  /**
   * The intro screen instance.
   * @type {IntroScreen}
   */
  introScreen;

  /**
   * The start screen instance.
   * @type {StartScreen}
   */
  startScreen;

  /**
   * The controls screen instance.
   * @type {ControlScreen}
   */
  controlsScreen;

  /**
   * The game over screen instance.
   * @type {GameOverScreen}
   */
  gameOverScreen;

  /**
   * The win screen instance.
   * @type {WinScreen}
   */
  winScreen;

  /**
   * The currently active screen being displayed and interacted with.
   * @type {IntroScreen|StartScreen|ControlScreen|GameOverScreen|WinScreen|OrientationScreen|null}
   */
  activeScreen;

  /**
   * A boolean flag indicating whether the game screen drawing loop is currently running.
   * @type {boolean}
   */
  isRunning;

  /**
   * The orientation screen instance, shown if the device is in portrait mode.
   * @type {OrientationScreen|null}
   */
  orientationScreen;

  /**
   * Creates a new ScreenManager instance, initializing all the game screens and setting the intro screen as the active screen.
   * It also starts the drawing loop and adds a resize event listener.
   * @param {HTMLCanvasElement} canvas - The canvas element for rendering.
   * @param {Function} startGameCallback - Callback to start the game.
   * @param {Function} showGameOverCallback - Callback to show the game over screen.
   * @param {Function} showWinScreenCallback - Callback to show the win screen.
   */
  constructor(
    canvas,
    startGameCallback,
    showGameOverCallback,
    showWinScreenCallback,
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.startGameCallback = startGameCallback;
    this.showGameOverCallback = showGameOverCallback;
    this.showWinScreenCallback = showWinScreenCallback;
    this.introScreen = new IntroScreen(canvas, this.showStartScreen.bind(this));
    this.startScreen = new StartScreen(
      canvas,
      this.startGame.bind(this),
      this.showControlsScreen.bind(this),
    );
    this.controlsScreen = new ControlScreen(
      canvas,
      this.showStartScreen.bind(this),
      this.startGame.bind(this),
    );
    this.gameOverScreen = new GameOverScreen(
      canvas,
      this.startGame.bind(this),
      this.showStartScreen.bind(this),
    );
    this.winScreen = new WinScreen(
      canvas,
      this.startGame.bind(this),
      this.closeGame,
    );
    this.activeScreen = this.introScreen;
    this.drawCurrentScreen();
    this.isRunning = true;
    this.drawLoop();

    window.addEventListener("resize", this.handleResize.bind(this));
  }

  /**
   * Starts a loop that periodically draws the currently active screen, maintaining a consistent frame rate.
   */
  drawLoop() {
    setInterval(() => {
      if (this.isRunning && this.activeScreen) {
        this.activeScreen.draw();
      }
    }, 1000 / 60); // Example FPS: 60
  }

  /**
   * Handles the resizing of the window. If the active screen has a `handleResize` method, it calls it;
   * otherwise, it falls back to calling the `draw` method of the active screen.
   */
  handleResize() {
    if (
      this.activeScreen &&
      typeof this.activeScreen.handleResize === "function"
    ) {
      this.activeScreen.handleResize();
    } else if (this.activeScreen) {
      this.activeScreen.draw(); // Fallback
    }
  }

  /**
   * Switches the active screen to the intro screen.
   */
  showIntroScreen() {
    this.switchToScreen(this.introScreen);
  }

  /**
   * Switches the active screen to the start screen.
   */
  showStartScreen() {
    this.switchToScreen(this.startScreen);
  }

  /**
   * Switches the active screen to the controls screen.
   */
  showControlsScreen() {
    this.switchToScreen(this.controlsScreen);
  }

  /**
   * Sets the active screen to null and calls the `startGameCallback` to initiate the game.
   */
  startGame() {
    this.activeScreen = null;
    this.startGameCallback();
  }

  /**
   * Switches the active screen to the game over screen.
   */
  showGameOverScreen() {
    // New method to show game over screen
    this.switchToScreen(this.gameOverScreen);
  }

  /**
   * Switches the active screen to the win screen.
   */
  showWinScreen() {
    this.switchToScreen(this.winScreen);
  }

  /**
   * Switches the currently active screen to the provided screen. If the previous screen had a
   * `removeEventListeners` method, it is called to clean up event listeners. The new screen's
   * `handleResize` method is called if it exists, otherwise its `draw` method is called as a fallback.
   * Finally, the new screen's `show` method is called, and the screen is drawn.
   * @param {IntroScreen|StartScreen|ControlScreen|GameOverScreen|WinScreen|OrientationScreen} screen - The screen to switch to.
   */
  switchToScreen(screen) {
    if (this.activeScreen && this.activeScreen.removeEventListeners) {
      this.activeScreen.removeEventListeners();
    }
    this.activeScreen = screen;
    if (typeof this.activeScreen.handleResize === "function") {
      this.activeScreen.handleResize();
    } else if (
      this.activeScreen &&
      typeof this.activeScreen.draw === "function"
    ) {
      this.activeScreen.draw();
    }
    this.activeScreen.show();
    this.drawCurrentScreen();
  }

  /**
   * Draws the currently active screen if one exists.
   */
  drawCurrentScreen() {
    if (this.activeScreen) {
      this.activeScreen.draw();
    }
  }

  /**
   * Checks the orientation of the window. If the width is less than the height (portrait mode),
   * it shows the orientation screen. Otherwise, if the active screen is the orientation screen,
   * it switches back to the intro screen.
   */
  checkOrientation() {
    if (window.innerWidth < window.innerHeight) {
      this.showOrientationScreen();
    } else {
      if (this.activeScreen instanceof OrientationScreen) {
        this.showIntroScreen();
      }
    }
  }

  /**
   * Creates and shows the orientation screen if it doesn't already exist.
   */
  showOrientationScreen() {
    if (!this.orientationScreen) {
      this.orientationScreen = new OrientationScreen(
        this.canvas,
        this.showIntroScreen.bind(this),
      );
    }
    this.switchToScreen(this.orientationScreen);
  }
}
