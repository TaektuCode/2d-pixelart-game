export class GameObject {
  position = {
    x: 0, // Standardwert
    y: 0, // Standardwert
  };
  img;
  width;
  height;
  speed = 0; // Standardwert

  constructor(x, y, img, width, height, speed) {
    this.position.x = x;
    this.position.y = y;
    this.img = img;
    this.width = width;
    this.height = height;
    this.speed = speed;
  }
}
