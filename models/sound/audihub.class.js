class AudioHub {
  static CHARACTERWALK = new Audio("assets/audio/charWalk.wav");

  static CHARACTERJUMP = new Audio("assets/audio/charJump.wav");

  static COLLECTCOIN = new Audio("assets/audio/collectCoin.wav");

  static COLLECTSTONE = new Audio("assets/audio/collectStone.wav");

  static allSounds = [AudioHub.CHARACTERWALK];

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
