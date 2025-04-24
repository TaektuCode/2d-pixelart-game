class StatusBar extends DrawableObject {
  IMAGE_BAR = ["assets/img/statusbars/health/hp_bar_full.png"];
  IMAGE_HP = ["assets/img/statusbars/health/hp_point.png"];

  percentage = 100;

  constructor() {
    super();
    this.loadImages(this.IMAGE_BAR);
    this.loadImages(this.IMAGE_HP);
    this.setPercentage(100);
    this.x = 10;
    this.y = 5;
    this.width = 200; // Breite des Rahmens
    this.height = 40; // Höhe des Rahmens
  }

  setPercentage(percentage) {
    this.percentage = percentage;
  }

  draw(ctx) {
    // Zeichne den Rahmen der Statusbar
    if (this.imageCache[this.IMAGE_BAR[0]]) {
      ctx.drawImage(
        this.imageCache[this.IMAGE_BAR[0]],
        this.x,
        this.y,
        this.width,
        this.height,
      );
    }

    // Berechne die Anzahl der anzuzeigenden HP-Punkte
    const hpPointsToShow = Math.max(0, Math.ceil(this.percentage / 10)); // Für alle 10 HP ein Punkt

    // Zeichne die HP-Punkte
    if (this.imageCache[this.IMAGE_HP[0]]) {
      const hpPointWidth = 12; // Beispielbreite eines HP-Punkts
      const spacing = 5; // Beispielabstand zwischen den HP-Punkten

      for (let i = 0; i < hpPointsToShow; i++) {
        const hpPointX = this.x + 17 + i * (hpPointWidth + spacing); // Positioniere die Punkte innerhalb des Rahmens
        const hpPointY = this.y + 10; // Beispiel y-Position innerhalb des Rahmens

        ctx.drawImage(
          this.imageCache[this.IMAGE_HP[0]],
          hpPointX,
          hpPointY,
          hpPointWidth,
          20, // Beispielhöhe des HP-Punkts
        );
      }
    }
  }
}
