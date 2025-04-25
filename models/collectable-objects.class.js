class CollectableObjects extends GameObject {
  constructor(x, y) {
    // Übergabe von x und y beim Erstellen
    super();
    this.loadImage("assets/img/collectables/coin1.png");
    this.x = x;
    this.y = y;
    this.width = 45;
    this.height = 45;
  }
}
