class AudioHub {
  static CHARACTERWALK = new Audio("assets/audio/charWalk.wav");

  static CHARACTERJUMP = new Audio("assets/audio/charJump.wav");

  static COLLECTCOIN = new Audio("assets/audio/collectCoin.wav");

  static COLLECTSTONE = new Audio("assets/audio/collectStone.wav");

  static ENEMY1DEAD = new Audio("assets/audio/enemy1Dead.wav");

  static ENEMY2DEAD = new Audio("assets/audio/enemy2Dead.wav");

  static allSounds = [
    AudioHub.CHARACTERWALK,
    AudioHub.CHARACTERJUMP,
    AudioHub.COLLECTCOIN,
    AudioHub.COLLECTSTONE,
    AudioHub.ENEMY1DEAD,
    AudioHub.ENEMY2DEAD,
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
