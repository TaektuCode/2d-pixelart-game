/**
 * Repräsentiert den Bildschirm für die Spielsteuerung.
 */
class ControlScreen {
  /**
   * Erstellt eine neue ControlScreen-Instanz.
   * @param {HTMLCanvasElement} canvas - Das Canvas-Element, auf dem der Bildschirm gerendert wird.
   * @param {Function} showStartScreenCallback - Callback-Funktion, die aufgerufen wird, um zum Startbildschirm zurückzukehren.
   * @param {Function} startGameCallback - Callback zum Starten des Spiels
   */
  constructor(canvas, showStartScreenCallback, startGameCallback) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.showStartScreenCallback = showStartScreenCallback;
    this.startGameCallback = startGameCallback; // Speichere den startGameCallback
    this.backgroundImage = new Image();
    this.backgroundImage.src = "assets/img/ui/menu_bg.png"; // Pfad zum Hintergrundbild
    this.backgroundImageLoaded = false;
    this.backButton = { x: 0, y: 100, width: 0, height: 0, label: "Back" }; // Dummy
    this.startGameButton = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      label: "Start Game",
    }; // Start Game Button
    this.setBindings();
    this.addEventListeners();

    this.backgroundImage.onload = () => {
      this.backgroundImageLoaded = true;
      this.draw();
    };
    this.draw();
  }

  setBindings() {
    this.boundHandleClick = this.handleClick.bind(this);
  }

  addEventListeners() {
    this.canvas.addEventListener("click", this.boundHandleClick);
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
    if (this.backgroundImageLoaded) {
      this.ctx.drawImage(
        this.backgroundImage,
        0,
        0,
        this.canvas.width,
        this.canvas.height,
      );
      const buttonWidth = 200;
      const buttonHeight = 50;
      const buttonSpacing = 20; // Abstand zwischen den Buttons

      // Berechne die Startposition für die Buttons, um sie horizontal zu zentrieren
      const totalButtonWidth = 2 * buttonWidth + buttonSpacing;
      const startX = (this.canvas.width - totalButtonWidth) / 2;
      const buttonY = this.canvas.height - buttonHeight - 75; // Beibehale die Y-Position

      this.backButton = {
        label: "Back",
        x: startX,
        y: buttonY,
        width: buttonWidth,
        height: buttonHeight,
      };
      this.startGameButton = {
        label: "Start Game",
        x: startX + buttonWidth + buttonSpacing,
        y: buttonY,
        width: buttonWidth,
        height: buttonHeight,
      };
      this.drawButton(this.backButton);
      this.drawButton(this.startGameButton);
      this.drawControlsText();
    } else {
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = "white";
      this.ctx.font = "20px sans-serif";
      this.ctx.textAlign = "center";
      this.ctx.fillText(
        "Loading...",
        this.canvas.width / 2,
        this.canvas.height / 2,
      );
    }
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

  drawControlsText() {
    this.ctx.fillStyle = "white";
    this.ctx.font = "20px sans-serif";
    this.ctx.textAlign = "center";

    const textLines = [
      "Use the following keys to control the game:",
      "",
      "",
      "Arrow Keys: Move your character",
      "Spacebar: Jump",
      "D: Attack",
    ];
    let maxWidth = 0;
    textLines.forEach((line) => {
      const width = this.ctx.measureText(line).width;
      if (width > maxWidth) {
        maxWidth = width;
      }
    });

    const startX = this.canvas.width / 2;
    let startY = this.canvas.height / 2 - (textLines.length * 30) / 2 - 50; // Adjusted position
    const lineHeight = 30;

    textLines.forEach((line) => {
      this.ctx.fillText(line, startX, startY);
      startY += lineHeight;
    });
  }

  handleClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    if (this.isPointInside(clickX, clickY, this.backButton)) {
      this.removeEventListeners();
      this.showStartScreenCallback();
    } else if (this.isPointInside(clickX, clickY, this.startGameButton)) {
      this.removeEventListeners();
      AudioHub.stopStartScreenMusic(); // Stoppe die Hintergrundmusik
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
