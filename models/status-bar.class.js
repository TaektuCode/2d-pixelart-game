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
    this.width = 200;
    this.height = 40;
  }

  setPercentage(percentage) {
    this.percentage = percentage;
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

    const hpPointsToShow = Math.max(0, Math.ceil(this.percentage / 10));

    if (this.imageCache[this.IMAGE_HP[0]]) {
      const hpPointWidth = 12;
      const spacing = 5;

      for (let i = 0; i < hpPointsToShow; i++) {
        const hpPointX = this.x + 17 + i * (hpPointWidth + spacing);
        const hpPointY = this.y + 10;

        ctx.drawImage(
          this.imageCache[this.IMAGE_HP[0]],
          hpPointX,
          hpPointY,
          hpPointWidth,
          20,
        );
      }
    }
  }
}
