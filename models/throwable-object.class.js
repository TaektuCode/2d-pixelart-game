class ThrowableObject extends GameObject {
  constructor(x, y) {
    // Übergabe von x und y beim Erstellen
    super();
    this.loadImage("assets/img/character/attack/stone.png");
    this.x = x - 30;
    this.y = y;
    this.width = 60;
    this.height = 60;
    this.speedY = 0; // Initial keine vertikale Geschwindigkeit
  }

  throw() {
    // Die throw-Methode wird aufgerufen, wenn die Taste gedrückt wird
    this.speedY = 15;
    this.applyGravity();
    setInterval(() => {
      this.x += 5;
    }, 25);
  }
}
