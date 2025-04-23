class MainCharacter extends GameObject {
  IMAGES_WALKING = [
    "assets/img/character/walk/walk1.png",
    "assets/img/character/walk/walk2.png",
    "assets/img/character/walk/walk3.png",
    "assets/img/character/walk/walk4.png",
    "assets/img/character/walk/walk5.png",
    "assets/img/character/walk/walk6.png",
  ];
  currentImage = 0;

  constructor() {
    super();
    this.loadImage("assets/img/character/walk/walk1.png");
    this.loadImages(this.IMAGES_WALKING);

    this.animate();
  }

  animate() {
    setInterval(() => {
      let i = this.currentImage % this.IMAGES_WALKING.length; // let i = 0 % 6
      let path = this.IMAGES_WALKING[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, 100);
  }

  jump() {}
}
