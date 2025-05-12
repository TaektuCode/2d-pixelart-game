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
    this.setBindings();
    this.addEventListeners();
    this.updateDimensions(); // Unbenannt und Ruft alles Notwendige auf
    this.backgroundImage.onload = () => {
      this.backgroundImageLoaded = true;
      this.draw();
    };
  }

  setBindings() {
    this.boundHandleClick = this.handleClick.bind(this);
    this.boundHandleResize = this.handleResize.bind(this); // Für Resize
  }

  addEventListeners() {
    this.canvas.addEventListener("click", this.boundHandleClick);
    this.canvas.addEventListener("touchstart", this.boundHandleClick);
    window.addEventListener("resize", this.boundHandleResize); // Listener für Fenstergröße
  }

  removeEventListeners() {
    this.canvas.removeEventListener("click", this.boundHandleClick);
    this.canvas.removeEventListener("touchstart", this.boundHandleClick);
    window.removeEventListener("resize", this.boundHandleResize); // Listener für Fenstergröße
  }

  handleResize() {
    this.updateDimensions();
    this.draw();
  }

  updateDimensions() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width; //explizit die Canvas Größe setzen
    this.canvas.height = rect.height;
    this.updateButtonPositions();
  }

  updateButtonPositions() {
    const rect = this.canvas.getBoundingClientRect(); // Jetzt immer aktuell
    const buttonWidth = 200;
    const buttonHeight = 50;
    const spacing = 20;
    const totalButtonWidth = buttonWidth * 2 + spacing;
    const startX = (rect.width - totalButtonWidth) / 2;
    const centerY = rect.height / 2 - buttonHeight / 2;

    this.startButton = {
      label: "Start Game",
      x: startX,
      y: centerY,
      width: buttonWidth,
      height: buttonHeight,
    };
    this.controlsButton = {
      label: "Controls",
      x: startX + buttonWidth + spacing,
      y: centerY,
      width: buttonWidth,
      height: buttonHeight,
    };
  }

  show() {
    this.addEventListeners(); // Event Listener hinzufügen
    this.updateDimensions();
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
    this.ctx.font = `${
      24 * (this.canvas.getBoundingClientRect().height / this.canvas.height)
    }px sans-serif`;
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
    console.log("handleClick Event:", event.type);
    let clientX, clientY;

    if (event.type === "touchstart") {
      const touch = event.changedTouches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
      event.preventDefault();
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    const rect = this.canvas.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const clickY = clientY - rect.top;

    console.log("Klick/Touch X:", clickX, "Y:", clickY);
    console.log("startButton:", this.startButton);
    console.log("controlsButton:", this.controlsButton);

    if (
      clickX >= this.startButton.x &&
      clickX <= this.startButton.x + this.startButton.width &&
      clickY >= this.startButton.y &&
      clickY <= this.startButton.y + this.startButton.height
    ) {
      this.removeEventListeners();
      AudioHub.stopStartScreenMusic();
      this.startGameCallback();
    } else if (
      clickX >= this.controlsButton.x &&
      clickX <= this.controlsButton.x + this.controlsButton.width &&
      clickY >= this.controlsButton.y &&
      clickY <= this.controlsButton.y + this.controlsButton.height
    ) {
      this.removeEventListeners();
      this.showControlsCallback();
    }
  }
}
