class StatusBarEndboss extends DrawableObject {
  IMAGE_BAR = [
    "assets/img/statusbars/enboss_health/stamina-energy-magic_bar_full.png",
  ];
  IMAGE_HP = ["assets/img/statusbars/enboss_health/stamina_point.png"];

  percentage = 100;

  constructor() {
    super();
    this.loadImages(this.IMAGE_BAR);
    this.loadImages(this.IMAGE_HP);
    this.setPercentage(100);
    this.y = 5;
    this.width = 200;
    this.height = 40;
  }
  setPercentage(percentage) {
    this.percentage = percentage;
  }

  draw(ctx) {
    this.drawHpBarBackground(ctx);
    this.drawHpIcons(ctx);
  }

  drawHpBarBackground(ctx) {
    if (this.imageCache[this.IMAGE_BAR[0]]) {
      ctx.drawImage(
        this.imageCache[this.IMAGE_BAR[0]],
        this.x,
        this.y,
        this.width,
        this.height,
      );
    }
  }

  drawHpIcons(ctx) {
    if (this.imageCache[this.IMAGE_HP[0]]) {
      const hpPointsToShow = this.calculateHpPointsToShow();
      const hpPointWidth = 12;
      const spacing = 5;
      const startX = this.x + 17;
      const startY = this.y + 10;
      this.renderHpIcons(
        ctx,
        startX,
        startY,
        hpPointWidth,
        spacing,
        hpPointsToShow,
      );
    }
  }

  calculateHpPointsToShow() {
    return Math.max(0, Math.ceil(this.percentage / 10));
  }

  renderHpIcons(ctx, startX, startY, hpPointWidth, spacing, hpPointsToShow) {
    for (let i = 0; i < hpPointsToShow; i++) {
      const hpPointX = startX + i * (hpPointWidth + spacing);
      ctx.drawImage(
        this.imageCache[this.IMAGE_HP[0]],
        hpPointX,
        startY,
        hpPointWidth,
        20,
      );
    }
  }
}
