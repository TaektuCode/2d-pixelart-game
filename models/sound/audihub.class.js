class AudioHub {
  static CHARACTERWALK = new Audio("assets/audio/charWalk.wav");

  static CHARACTERJUMP = new Audio("assets/audio/charJump.wav");

  static THROWSTONE = new Audio("assets/audio/throwStone.wav");

  static COLLECTCOIN = new Audio("assets/audio/collectCoin.wav");

  static COLLECTSTONE = new Audio("assets/audio/collectStone.wav");

  static ENEMY1DEAD = new Audio("assets/audio/enemy1Dead.wav");

  static ENEMY2DEAD = new Audio("assets/audio/enemy2Dead.wav");

  static ENDBOSS_ACTIVATION = new Audio("assets/audio/endbossContact.wav");

  static ENDBOSS_STEP = new Audio("assets/audio/endbossStep.wav");

  static ENDBOSS_HURT = new Audio("assets/audio/endbossHurt.wav");

  static ENDBOSS_DEATH = new Audio("assets/audio/endbossDeath.wav");

  static allSounds = [
    AudioHub.CHARACTERWALK,
    AudioHub.CHARACTERJUMP,
    AudioHub.COLLECTCOIN,
    AudioHub.COLLECTSTONE,
    AudioHub.ENEMY1DEAD,
    AudioHub.ENEMY2DEAD,
    AudioHub.THROWSTONE,
    AudioHub.ENDBOSS_ACTIVATION,
    AudioHub.ENDBOSS_STEP,
    AudioHub.ENDBOSS_DEATH,
  ];

  static playOneSound(sound) {
    const soundOn = localStorage.getItem("musicOn") === "true";
    if (!soundOn) return;
    sound.volume = 0.2;
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  static stopAllSounds() {
    AudioHub.allSounds.forEach((sound) => sound.pause());
  }

  static stopOneSound(sound) {
    sound.pause();
  }
}
