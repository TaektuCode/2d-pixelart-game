/**
 * Repräsentiert den Bildschirm mit der Spielsteuerung.
 */
class ControlScreen {
  /**
   * Erstellt eine neue ControlScreen-Instanz.
   * @param {HTMLCanvasElement} canvas - Das Canvas-Element, auf dem der Bildschirm gerendert wird.
   * @param {Function} showStartScreenCallback - Callback-Funktion, um zum Startbildschirm zurückzukehren.
   */
  constructor(canvas, showStartScreenCallback) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.showStartScreenCallback = showStartScreenCallback;
    this.backgroundImage = new Image();
    this.backgroundImage.src = "assets/img/9_intro_outro_screens/controls.png"; // Passe den Pfad an
    this.backButton = {
      label: "Zurück",
      x: 50,
      y: 400,
      width: 100,
      height: 40,
    }; // Passe Position und Text an
    this.setBindings();
    this.addEventListeners();
    this.backgroundImage.onload = () => this.draw();
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
    this.ctx.fillStyle = "lightgray";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.backgroundImage.complete) {
      this.ctx.drawImage(
        this.backgroundImage,
        0,
        0,
        this.canvas.width,
        this.canvas.height,
      );
    }
    this.ctx.font = "24px Arial";
    this.ctx.fillStyle = "black";
    this.ctx.fillText("Steuerung:", 50, 50);
    this.ctx.fillText("Pfeiltasten links/rechts: Bewegen", 50, 80);
    this.ctx.fillText("Pfeiltaste hoch: Springen", 50, 110);
    this.ctx.fillText("Taste D: Werfen", 50, 140);
    // Zeichne Zurück-Button
    this.ctx.fillStyle = "darkgray";
    this.ctx.fillRect(
      this.backButton.x,
      this.backButton.y,
      this.backButton.width,
      this.backButton.height,
    );
    this.ctx.fillStyle = "white";
    this.ctx.fillText(
      this.backButton.label,
      this.backButton.x + 10,
      this.backButton.y + 25,
    );
  }

  handleClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    if (
      clickX > this.backButton.x &&
      clickX < this.backButton.x + this.backButton.width &&
      clickY > this.backButton.y &&
      clickY < this.backButton.y + this.backButton.height
    ) {
      this.removeEventListeners();
      this.showStartScreenCallback();
    }
  }
}
