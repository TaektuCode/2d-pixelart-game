class MainCharacter extends GameObject {
  constructor() {
    super();
    this.loadImage("assets/img/character/walk/walk1.png");
    this.loadImages([
      "assets/img/character/walk/walk1.png",
      "assets/img/character/walk/walk2.png",
      "assets/img/character/walk/walk3.png",
      "assets/img/character/walk/walk4.png",
      "assets/img/character/walk/walk5.png",
      "assets/img/character/walk/walk6.png",
    ]);
  }

  jump() {}
}
