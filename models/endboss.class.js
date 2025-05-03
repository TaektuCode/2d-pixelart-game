class Endboss extends GameObject {
  y = 200;
  width = 400;
  height = 350;
  dead = false;
  isMovingLeft = false;
  isHitState = false;
  lastHitTime = 0;
  hurtAnimationDuration = 500;

  IMAGES_WALKING = [
    "assets/img/endboss/walk/Walk1_flip.png",
    "assets/img/endboss/walk/Walk2_flip.png",
    "assets/img/endboss/walk/Walk3_flip.png",
    "assets/img/endboss/walk/Walk4_flip.png",
    "assets/img/endboss/walk/Walk5_flip.png",
    "assets/img/endboss/walk/Walk6_flip.png",
  ];

  IMAGES_HURT = [
    "assets/img/endboss/hurt/Hurt1_flip.png",
    "assets/img/endboss/hurt/Hurt2_flip.png",
  ];

  constructor() {
    super();
    this.loadImage("assets/img/endboss/walk/Walk1_flip.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_HURT);
    this.x = 2550;
    this.hp = 90;
    this.speed = 0.45;
    this.animate();
    this.startMovingLeft();

    this.offset = {
      top: 130, //Die Kollisionsbox beginnt x Pixel unterhalb der oberen Bildgrenze
      left: 185, //Die Kollisionsbox beginnt x Pixel rechts der linken Bildgrenze
      right: 90, //Die Kollisionsbox endet x Pixel links der rechten Bildgrenze
      bottom: 90, //Die Kollisionsbox endet x Pixel oberhalb der unteren Bildgrenze
    };
  }

  animate() {
    setInterval(() => {
      if (this.isHitState) {
        this.playAnimation(this.IMAGES_HURT);
        // Nach der Dauer der Hurt-Animation den Hit-Zustand zurücksetzen und Bewegung wieder erlauben
        if (Date.now() - this.lastHitTime > this.hurtAnimationDuration) {
          this.isHitState = false;
          this.isMovingLeft = true; // Boss soll nach der Hurt-Animation wieder laufen
        }
      } else if (this.isMovingLeft) {
        this.playAnimation(this.IMAGES_WALKING);
      } else {
        // Standard-Animation, wenn weder Hit noch aktive Bewegung
        this.playAnimation(this.IMAGES_WALKING); // Oder eine Idle-Animation
      }
    }, 200);
  }

  startMovingLeft() {
    this.isMovingLeft = true; // Initial den Bewegungszustand setzen
    setInterval(() => {
      if (this.isMovingLeft) {
        // Bewege nur, wenn der Zustand aktiv ist
        this.moveLeft();
      }
    }, 1000 / 60);
  }

  hit(damage) {
    this.hp -= damage;
    this.isHitState = true; // Setze den Hit-Zustand
    this.isMovingLeft = false; // Stoppe die Bewegung beim Hit
    this.lastHitTime = Date.now(); // Speichere den Zeitpunkt des Treffers
    if (this.hp < 0) {
      this.hp = 0;
    }
  }
}
