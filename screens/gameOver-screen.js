class GameOverScreen {
  constructor(canvas, restartCallback, menuCallback) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.restartCallback = restartCallback;
    this.menuCallback = menuCallback;
    this.width = canvas.width;
    this.height = canvas.height;
    this.backgroundImage = new Image();
    this.backgroundImage.src = "assets/img/ui/menu_bg.png";
    this.backgroundImageLoaded = false;
    this.restartButton = {
      x: this.width / 2 - 150,
      y: this.height / 2,
      width: 300,
      height: 50,
      text: "Restart Game",
    };
    this.menuButton = {
      x: this.width / 2 - 150,
      y: this.height / 2 + 60,
      width: 300,
      height: 50,
      text: "Back to Menu",
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

    if (this.isPointInside(x, y, this.restartButton)) {
      this.removeEventListeners();
      this.restartCallback();
    } else if (this.isPointInside(x, y, this.menuButton)) {
      this.removeEventListeners();
      this.menuCallback();
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
    this.ctx.font = "bold 48px sans-serif";
    this.ctx.fillStyle = "red";
    this.ctx.textAlign = "center";
    this.ctx.shadowColor = "black";
    this.ctx.shadowBlur = 10;
    this.ctx.fillText("Game Over", this.width / 2, this.height / 4);
    this.ctx.shadowBlur = 0;
  }

  drawButtons() {
    this.drawButton(this.restartButton);
    this.drawButton(this.menuButton);
  }

  drawButton(button) {
    this.ctx.fillStyle = "rgba(0, 153, 255, 0.8)";
    this.ctx.fillRect(button.x, button.y, button.width, button.height);
    this.ctx.strokeStyle = "rgba(0, 102, 204, 1)";
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(button.x, button.y, button.width, button.height);
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
