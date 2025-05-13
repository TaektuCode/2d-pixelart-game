/**
 * Repräsentiert den Startbildschirm des Spiels.
 */
class StartScreen {
  /**
   * Erstellt eine neue StartScreen-Instanz.
   * @param {HTMLCanvasElement} canvas - Das Canvas-Element, auf dem der Bildschirm gerendert wird.
   * @param {Function} startGameCallback - Callback-Funktion, die aufgerufen wird, wenn das Spiel gestartet werden soll.
   * @param {Function} showControlsCallback - Callback-Funktion, die aufgerufen wird, um den Controls-Bildschirm anzuzeigen.
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
      // Oben
      label: "Control",
      x: canvas.width / 2 - 110,
      y: canvas.height / 2 - 75,
      width: 200,
      height: 50,
    };
    this.controlsButton = {
      // Unten
      label: "Start Game",
      x: canvas.width / 2 - 110,
      y: canvas.height / 2,
      width: 200,
      height: 50,
    };
    this.imprintButton = {
      label: "Imprint",
      x: 25,
      y: 75, // Unterhalb des Controls-Buttons
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

  handleResize() {
    this.startButton.x = this.canvas.width / 2 - 110;
    this.startButton.y = this.canvas.height / 2 - 100;
    this.controlsButton.x = this.canvas.width / 2 - 110;
    this.controlsButton.y = this.canvas.height / 2;
    (this.imprintButton.x = 25), (this.imprintButton.y = 25), this.draw();
  }

  setBindings() {
    this.boundHandleClick = this.handleClick.bind(this);
  }

  addEventListeners() {
    this.canvas.addEventListener("click", this.boundHandleClick);
    this.canvas.addEventListener("touchstart", this.boundHandleClick); // Für Touch-Eingabe
  }

  removeEventListeners() {
    this.canvas.removeEventListener("click", this.boundHandleClick);
    this.canvas.removeEventListener("touchstart", this.boundHandleClick); // Auch Touch-Listener entfernen
  }

  show() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.addEventListeners();
    this.draw();
  }

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

  drawButton(button) {
    this.ctx.lineWidth = 2;

    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.fillRect(button.x, button.y, button.width, button.height);

    // Schriftgröße für den Impressum-Button anpassen
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

  handleClick(event) {
    console.log("handleClick wurde ausgelöst!", event.type);
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

    console.log("Klick/Touch Koordinaten:", clickX, clickY);
    console.log("Start Button:", this.startButton);
    console.log("Controls Button:", this.controlsButton);

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

  isPointInside(x, y, rect) {
    return (
      x >= rect.x &&
      x <= rect.x + rect.width &&
      y >= rect.y &&
      y <= rect.y + rect.height
    );
  }
}
