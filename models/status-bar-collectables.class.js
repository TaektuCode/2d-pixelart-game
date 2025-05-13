class StatusBarCollectables extends DrawableObject {
  IMAGE_BAR = ["assets/img/statusbars/health/hp_bar_full.png"];
  IMAGE_POINT = ["assets/img/statusbars/attacks/magic_point.png"];
  collectableCount = 0;

  constructor() {
    super();
    this.loadImages(this.IMAGE_BAR);
    this.loadImages(this.IMAGE_POINT);
    this.setCollectableCount(0);
    this.x = 10;
    this.y = 50;
    this.width = 200;
    this.height = 30;
  }

  setCollectableCount(count) {
    this.collectableCount = count;
  }

  draw(ctx) {
    if (this.imageCache[this.IMAGE_BAR[0]]) {
      ctx.drawImage(
        this.imageCache[this.IMAGE_BAR[0]],
        this.x,
        this.y,
        this.width,
        this.height,
      );
    }

    if (this.imageCache[this.IMAGE_POINT[0]]) {
      const iconWidth = 25;
      const iconHeight = 15;
      const spacing = 3;
      const startX = this.x + 17;
      const startY = this.y + (this.height - iconHeight) / 2;
      const maxPointsToShow = 6; // Begrenze die Anzahl der angezeigten Icons

      for (
        let i = 0;
        i < Math.min(this.collectableCount, maxPointsToShow);
        i++
      ) {
        const iconX = startX + i * (iconWidth + spacing);
        ctx.drawImage(
          this.imageCache[this.IMAGE_POINT[0]],
          iconX,
          startY,
          iconWidth,
          iconHeight,
        );
      }

      ctx.font = "16px sans-serif";
      ctx.fillStyle = "white";
      ctx.textAlign = "right";
      ctx.fillText(
        `${this.collectableCount}`,
        this.x + this.width - 25,
        this.y + 20,
      );
      ctx.textAlign = "start";
    }
  }
}
