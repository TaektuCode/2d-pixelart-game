class ScreenManager {
  constructor(canvas, startGameCallback) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.startGameCallback = startGameCallback;
    this.introScreen = new IntroScreen(
      canvas,
      this.showStartScreen.bind(this), // Callback zum Anzeigen des Startbildschirms
    );
    this.startScreen = new StartScreen(
      canvas,
      this.startGame.bind(this),
      this.showControlsScreen.bind(this),
    );
    this.controlsScreen = new ControlScreen(
      canvas,
      this.showStartScreen.bind(this),
    );
    this.activeScreen = this.introScreen; // Starte mit dem Intro-Bildschirm
    this.drawCurrentScreen(); // Zeichne den Intro-Bildschirm initial
  }

  showIntroScreen() {
    if (this.activeScreen && this.activeScreen.removeEventListeners) {
      this.activeScreen.removeEventListeners();
    }
    this.activeScreen = this.introScreen;
    this.activeScreen.show();
    this.drawCurrentScreen();
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
        this.showIntroScreen(); // Oder den vorherigen Bildschirm
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
    if (this.activeScreen && this.activeScreen.removeEventListeners) {
      this.activeScreen.removeEventListeners();
    }
    this.activeScreen = this.orientationScreen;
    this.activeScreen.show();
    this.drawCurrentScreen();
  }
}
