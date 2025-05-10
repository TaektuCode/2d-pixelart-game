class ScreenManager {
  constructor(canvas, startGameCallback, showGameOverCallback) {
    // Added showGameOverCallback
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.startGameCallback = startGameCallback;
    this.showGameOverCallback = showGameOverCallback; // Store the new callback
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
    this.gameOverScreen = new GameOverScreen( // Create GameOverScreen instance
      canvas,
      this.startGame.bind(this), // Restart callback
      this.showStartScreen.bind(this), // Menu callback
    );
    this.activeScreen = this.introScreen;
    this.drawCurrentScreen();
  }

  showIntroScreen() {
    this.switchToScreen(this.introScreen);
  }

  showStartScreen() {
    this.switchToScreen(this.startScreen);
  }

  showControlsScreen() {
    this.switchToScreen(this.controlsScreen);
  }

  startGame() {
    this.activeScreen = null;
    this.startGameCallback();
  }

  showGameOverScreen() {
    // New method to show game over screen
    this.switchToScreen(this.gameOverScreen);
  }

  switchToScreen(screen) {
    if (this.activeScreen && this.activeScreen.removeEventListeners) {
      this.activeScreen.removeEventListeners();
    }
    this.activeScreen = screen;
    this.activeScreen.show();
    this.drawCurrentScreen();
  }

  drawCurrentScreen() {
    if (this.activeScreen) {
      this.activeScreen.draw();
    }
  }

  checkOrientation() {
    if (window.innerWidth < window.innerHeight) {
      this.showOrientationScreen();
    } else {
      if (this.activeScreen instanceof OrientationScreen) {
        this.showIntroScreen();
      }
    }
  }

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
