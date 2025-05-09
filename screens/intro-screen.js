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
    this.draw(); // Zeichne initial (zeigt evtl. nur Text, falls Bild noch nicht geladen)
  }

  addEventListeners() {
    this.boundHandleClick = this.handleClick.bind(this);
    this.canvas.addEventListener("click", this.boundHandleClick);
  }

  removeEventListeners() {
    this.canvas.removeEventListener("click", this.boundHandleClick);
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
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = "white";
      this.ctx.font = "52px OldLondon";
      this.ctx.textAlign = "center";
      this.ctx.fillText("Story", this.canvas.width / 2, 100);

      this.ctx.font = "28px OldLondon";
      const text =
        "The evil Orc Toran casts a dark shadow. Small rogue Flicker, despite his size, is the only hope to defeat him and save the land.";
      const maxWidth = this.canvas.width * 0.5; // 80% der Canvas-Breite
      const lineHeight = 30; // Etwas größer als die Schriftgröße
      const textY = 200;

      this.wrapText(
        this.ctx,
        text,
        this.canvas.width / 2,
        textY,
        maxWidth,
        lineHeight,
      );

      this.ctx.font = "bold 24px serif";
      this.ctx.fillText("START", this.canvas.width / 2, 400);
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
    this.removeEventListeners();
    AudioHub.playLoopingSound(AudioHub.STARTSCREEN_MUSIC);
    this.onContinueCallback(); // Wechsel zum StartScreen
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
