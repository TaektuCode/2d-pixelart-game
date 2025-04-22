export class GameObject {
  position = {
    x: 0,
    y: 1,
  };
  img;
  width;
  height;
  velocity = {
    x: 0,
    y: 0.5,
  };
  gravity;

  constructor(position, img, width, height, velocity, gravity) {
    this.position.x = position.x;
    this.position.y = position.y;
    this.img = img;
    this.width = width;
    this.height = height;
    this.velocity.x = velocity.x;
    this.velocity.y = velocity.y;
    this.gravity = gravity;
  }

  draw(context) {
    // console.log(...); // Debug-Ausgaben gehören eher in update() oder temporär hierhin
    context.fillStyle = "blue";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    console.log("Canvas height:", canvas.height);
    this.position.x += this.velocity.x;
    this.velocity.y += this.gravity; // Gravitation in jedem Frame anwenden

    // Kollisionserkennung mit dem unteren Rand
    if (this.position.y + this.height >= canvas.height) {
      this.position.y = canvas.height - this.height;
      this.velocity.y = 0; // Stoppe die vertikale Bewegung
    }
  }

  animate(context) {
    console.log("Animate in GameObject wird aufgerufen für:", this);
    requestAnimationFrame(() => {
      this.update();
      this.draw(context);
      this.animate(context); // Rekursiver Aufruf mit Arrow-Funktion
    });
  }
}
