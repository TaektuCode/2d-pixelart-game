class ScreenManager {
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

  drawLoop() {
    setInterval(() => {
      if (this.isRunning && this.activeScreen) {
        this.activeScreen.draw();
      }
    }, 1000 / 60); // Beispiel-FPS
  }

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

  showWinScreen() {
    this.switchToScreen(this.winScreen);
  }

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
