class IntroScreen {
  constructor(canvas, onContinueCallback) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.onContinueCallback = onContinueCallback;
    this.backgroundImage = new Image();
    this.backgroundImage.src = "assets/img/ui/menu_bg.png";
    this.backgroundImageLoaded = false;

    this.backgroundImage.onload = () => {
      this.backgroundImageLoaded = true;
      this.draw();
    };

    this.addEventListeners();
    this.draw(); // Zeichne initial
  }

  handleResize() {
    this.draw(); // Bei Größenänderung neu zeichnen, um Textpositionen anzupassen
  }

  addEventListeners() {
    this.boundHandleClick = this.handleClick.bind(this);
    this.canvas.addEventListener("click", this.boundHandleClick);
    this.canvas.addEventListener("touchstart", this.boundHandleClick); // Für Touch-Eingabe
  }

  removeEventListeners() {
    this.canvas.removeEventListener("click", this.boundHandleClick);
    this.canvas.removeEventListener("touchstart", this.boundHandleClick);
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
      this.ctx.fillStyle = "white";
      this.ctx.font = `52px OldLondon`;
      this.ctx.textAlign = "center";
      this.ctx.fillText("Story", this.canvas.width / 2, 100);

      this.ctx.font = `28px OldLondon`;
      const text =
        "The evil Orc Toran casts a dark shadow. Small rogue Flicker, despite his size, is the only hope to defeat him and save the land.";
      const maxWidth = this.canvas.width * 0.8; // 80% der Canvas-Breite
      const lineHeight = 30;
      const textY = 200;

      this.wrapText(
        this.ctx,
        text,
        this.canvas.width / 2,
        textY,
        maxWidth,
        lineHeight,
      );

      this.ctx.font = `bold 24px serif`;
      this.ctx.fillText(
        "START",
        this.canvas.width / 2,
        this.canvas.height * 0.8,
      ); // Position relativ zur Höhe
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

  handleClick() {
    AudioHub.playLoopingSound(AudioHub.STARTSCREEN_MUSIC);
    this.onContinueCallback(); // Wechsel zum StartScreen
    this.removeEventListeners();
  }

  wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    let testLine = "";
    let metrics = null;

    for (let i = 0; i < words.length; i++) {
      testLine += words[i] + " ";
      metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && i > 0) {
        context.fillText(line, x, y);
        line = words[i] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
      testLine = line;
    }
    context.fillText(line, x, y);
  }
}
