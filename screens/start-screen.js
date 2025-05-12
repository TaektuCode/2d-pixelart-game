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
      label: "Controls",
      x: canvas.width / 2 - 110,
      y: canvas.height / 2 - 75,
      width: 200,
      height: 50,
    };
    this.controlsButton = {
      label: "Start Game",
      x: canvas.width / 2 - 110,
      y: canvas.height / 2,
      width: 200,
      height: 50,
    };
    this.setBindings();
    this.addEventListeners();
    this.backgroundImage.onload = () => {
      this.backgroundImageLoaded = true;
      this.draw();
    };
  }

  setBindings() {
    this.boundHandleClick = this.handleClick.bind(this);
  }

  addEventListeners() {
    this.canvas.addEventListener("click", this.boundHandleClick);
    this.canvas.addEventListener("touchstart", this.boundHandleClick);
  }

  removeEventListeners() {
    this.canvas.removeEventListener("click", this.boundHandleClick);
  }

  show() {
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
  }

  drawButton(button) {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.fillRect(button.x, button.y, button.width, button.height);
    this.ctx.font = "24px sans-serif";
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      button.label,
      button.x + button.width / 2,
      button.y + button.height / 2,
    );
  }

  handleClick(event) {
    console.log("handleClick Event:", event.type);
    let clientX, clientY;

    if (event.type === "touchstart") {
      // Touch-Ereignis: Koordinaten vom ersten berührenden Finger holen
      const touch = event.touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
      event.preventDefault(); // Verhindert zusätzliche Mausereignisse
    } else {
      // Maus-Ereignis: Koordinaten vom Maus-Event holen
      clientX = event.clientX;
      clientY = event.clientY;
    }

    const rect = this.canvas.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const clickY = clientY - rect.top;

    console.log("Klick/Touch X:", clickX, "Y:", clickY);
    console.log("startButton:", this.startButton);
    console.log("controlsButton:", this.controlsButton);

    if (this.isPointInside(clickX, clickY, this.startButton)) {
      this.removeEventListeners();
      this.showControlsCallback();
    } else if (this.isPointInside(clickX, clickY, this.controlsButton)) {
      this.removeEventListeners();
      AudioHub.stopStartScreenMusic();
      this.startGameCallback();
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
