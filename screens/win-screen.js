class WinScreen {
  constructor(canvas, playAgainCallback, closeGameCallback) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.playAgainCallback = playAgainCallback;
    this.closeGameCallback = closeGameCallback;
    this.width = canvas.width;
    this.height = canvas.height;
    this.backgroundImage = new Image();
    this.backgroundImage.src = "assets/img/ui/menu_bg.png";
    this.backgroundImageLoaded = false;
    this.playAgainButton = {
      x: this.width / 2 - 150,
      y: this.height / 2,
      width: 300,
      height: 50,
      text: "Play Again",
    };
    this.closeGameButton = {
      x: this.width / 2 - 150,
      y: this.height / 2 + 60,
      width: 300,
      height: 50,
      text: "Close Game",
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
  }

  removeEventListeners() {
    this.canvas.removeEventListener("click", this.boundHandleClick);
  }

  handleClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (this.isPointInside(x, y, this.playAgainButton)) {
      this.removeEventListeners();
      this.playAgainCallback();
    } else if (this.isPointInside(x, y, this.closeGameButton)) {
      this.removeEventListeners();
      //   this.closeGameCallback();
    }
  }

  isPointInside(x, y, button) {
    return (
      x > button.x &&
      x < button.x + button.width &&
      y > button.y &&
      y < button.y + button.height
    );
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.backgroundImageLoaded) {
      this.ctx.drawImage(this.backgroundImage, 0, 0, this.width, this.height);
    }
    this.drawText();

    this.drawButtons();
  }

  drawText() {
    this.ctx.font = "bold 64px OldLondon";
    this.ctx.fillStyle = "green"; // Changed color to green for "You Won"
    this.ctx.textAlign = "center";
    this.ctx.fillText("You Won!", this.width / 2, this.height / 4); // Changed text
    this.ctx.shadowBlur = 0;
  }

  drawButtons() {
    this.drawButton(this.playAgainButton);
    this.drawButton(this.closeGameButton);
  }

  drawButton(button) {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.fillRect(button.x, button.y, button.width, button.height);
    this.ctx.font = "bold 24px sans-serif";
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(
      button.text,
      button.x + button.width / 2,
      button.y + button.height / 2,
    );
  }

  show() {
    this.addEventListeners();
    this.draw();
  }

  hide() {
    this.removeEventListeners();
  }
}
