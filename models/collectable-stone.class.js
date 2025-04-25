class CollectableStone extends GameObject {
  constructor(x, y) {
    // Übergabe von x und y beim Erstellen
    super();
    this.loadImage("assets/img/character/attack/stone.png");
    this.x = x;
    this.y = y;
    this.width = 45;
    this.height = 45;

    this.offset = {
      top: 10, //Die Kollisionsbox beginnt x Pixel unterhalb der oberen Bildgrenze
      left: 10, //Die Kollisionsbox beginnt x Pixel rechts der linken Bildgrenze
      right: 10, //Die Kollisionsbox endet x Pixel links der rechten Bildgrenze
      bottom: 10, //Die Kollisionsbox endet x Pixel oberhalb der unteren Bildgrenze
    };
  }
}
