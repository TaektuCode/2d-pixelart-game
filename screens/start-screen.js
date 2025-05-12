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
    this.updateButtonPositions(); // Initial Button-Positionen setzen
    this.setBindings();
    this.addEventListeners();
    this.backgroundImage.onload = () => {
      this.backgroundImageLoaded = true;
      this.draw();
    };
  }

  updateButtonPositions() {
    const rect = this.canvas.getBoundingClientRect();
    const buttonWidth = 200;
    const buttonHeight = 50;
    const spacing = 20; // Abstand zwischen den Buttons

    const totalWidth = buttonWidth * 2 + spacing;
    const startX = (rect.width - totalWidth) / 2; // Zentriert die Button-Gruppe horizontal

    this.startButton = {
      // "Controls"-Button (jetzt links)
      label: "Start Game",
      x: startX,
      y: rect.height / 2 - buttonHeight / 2, // Zentriert vertikal
      width: buttonWidth,
      height: buttonHeight,
    };
    this.controlsButton = {
      // "Start Game"-Button (jetzt rechts)
      label: "Controls",
      x: startX + buttonWidth + spacing,
      y: rect.height / 2 - buttonHeight / 2, // Zentriert vertikal
      width: buttonWidth,
      height: buttonHeight,
    };
  }

  handleResize() {
    this.updateButtonPositions();
    this.draw();
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
      const touch = event.touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
      event.preventDefault();
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    const rect = this.canvas.getBoundingClientRect();
    console.log("Canvas getBoundingClientRect():", rect);

    const clickX = clientX - rect.left;
    const clickY = clientY - rect.top;

    console.log(
      "startButton (Start Game) - X:",
      this.startButton.x,
      "EndX:",
      this.startButton.x + this.startButton.width,
      "Y:",
      this.startButton.y,
      "EndY:",
      this.startButton.y + this.startButton.height,
    );
    console.log(
      "controlsButton (Controls) - X:",
      this.controlsButton.x,
      "EndX:",
      this.controlsButton.x + this.controlsButton.width,
      "Y:",
      this.controlsButton.y,
      "EndY:",
      this.controlsButton.y + this.controlsButton.height,
    );
    console.log("Klick/Touch X:", clickX, "Y:", clickY);

    // Zuerst prüfen, ob der Klick im Bereich des "Start Game"-Buttons liegt
    if (
      clickX >= this.startButton.x &&
      clickX <= this.startButton.x + this.startButton.width &&
      clickY >= this.startButton.y &&
      clickY <= this.startButton.y + this.startButton.height
    ) {
      this.removeEventListeners();
      AudioHub.stopStartScreenMusic();
      this.startGameCallback();
    }
    // Dann prüfen, ob der Klick im Bereich des "Controls"-Buttons liegt
    else if (
      clickX >= this.controlsButton.x &&
      clickX <= this.controlsButton.x + this.controlsButton.width &&
      clickY >= this.controlsButton.y &&
      clickY <= this.controlsButton.y + this.controlsButton.height
    ) {
      this.removeEventListeners();
      this.showControlsCallback();
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
