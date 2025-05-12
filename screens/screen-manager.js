class ScreenManager {
  constructor(
    canvas,
    startGameCallback,
    showGameOverCallback,
    showWinScreenCallback,
  ) {
    // Optional: showWinScreenCallback hinzufügen, falls noch nicht vorhanden
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.startGameCallback = startGameCallback;
    this.showGameOverCallback = showGameOverCallback;
    this.showWinScreenCallback = showWinScreenCallback; // Store the new callback
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
    this.winScreen = new WinScreen( // Erstelle eine Instanz des WinScreen
      canvas,
      this.startGame.bind(this), // Callback für "Play Again" (hier wird startGame verwendet)
      this.closeGame, // Callback für "Close Game" (muss noch definiert werden)
    );
    this.activeScreen = this.introScreen;
    this.drawCurrentScreen();
    this.isRunning = true;
    this.drawLoop();

    // Event Listener für Fenstergrößenänderungen hinzufügen
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
      this.activeScreen.draw(); // Fallback, falls handleResize nicht existiert
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

  closeGame() {
    window.close(); // Diese Funktion schließt das Browserfenster
  }

  switchToScreen(screen) {
    if (this.activeScreen && this.activeScreen.removeEventListeners) {
      this.activeScreen.removeEventListeners();
    }
    this.activeScreen = screen;
    if (typeof this.activeScreen.handleResize === "function") {
      this.activeScreen.handleResize(); // Initial draw/positioning after switching
    } else if (
      this.activeScreen &&
      typeof this.activeScreen.draw === "function"
    ) {
      this.activeScreen.draw();
    }
    this.drawCurrentScreen(); // Zeichne den neuen Bildschirm sofort
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
