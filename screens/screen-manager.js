class ScreenManager {
  constructor(canvas, startGameCallback) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.startGameCallback = startGameCallback;
    this.startScreen = new StartScreen(
      canvas,
      this.startGame.bind(this),
      this.showControlsScreen.bind(this),
    );
    this.controlsScreen = new ControlScreen(
      canvas,
      this.showStartScreen.bind(this),
    );
    this.activeScreen = this.startScreen; // Starte mit dem Startbildschirm
    this.drawCurrentScreen(); // Zeichne den Startbildschirm initial
  }

  showStartScreen() {
    if (this.activeScreen && this.activeScreen.removeEventListeners) {
      this.activeScreen.removeEventListeners();
    }
    this.activeScreen = this.startScreen;
    this.activeScreen.show();
    this.drawCurrentScreen();
  }

  showControlsScreen() {
    if (this.activeScreen && this.activeScreen.removeEventListeners) {
      this.activeScreen.removeEventListeners();
    }
    this.activeScreen = this.controlsScreen;
    this.activeScreen.show();
    this.drawCurrentScreen();
  }

  startGame() {
    if (this.activeScreen && this.activeScreen.removeEventListeners) {
      this.activeScreen.removeEventListeners();
    }
    this.activeScreen = null; // Setze activeScreen auf null, um das Spiel zu starten
    this.startGameCallback(); // Rufe die startGame-Funktion in game.js auf
  }

  drawCurrentScreen() {
    if (this.activeScreen) {
      this.activeScreen.draw();
    }
  }

  checkOrientation() {
    if (window.innerWidth < window.innerHeight) {
      // Portrait-Modus
      this.showOrientationScreen();
    } else {
      // Landscape-Modus
      if (this.activeScreen instanceof OrientationScreen) {
        this.showStartScreen(); // Oder den vorherigen Bildschirm
      }
    }
  }

  showOrientationScreen() {
    if (!this.orientationScreen) {
      this.orientationScreen = new OrientationScreen(
        this.canvas,
        this.showStartScreen.bind(this),
      );
    }
    if (this.activeScreen && this.activeScreen.removeEventListeners) {
      this.activeScreen.removeEventListeners();
    }
    this.activeScreen = this.orientationScreen;
    this.activeScreen.show();
    this.drawCurrentScreen();
  }
}
