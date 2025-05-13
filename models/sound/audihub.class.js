/**
 * @file Manages all audio elements and provides static methods for playing,
 * stopping, and muting sounds within the game.
 */
class AudioHub {
  /**
   * Audio for character walking.
   * @type {HTMLAudioElement}
   */
  static CHARACTERWALK = new Audio("assets/audio/charWalk.wav");
  /**
   * Audio for character jumping.
   * @type {HTMLAudioElement}
   */
  static CHARACTERJUMP = new Audio("assets/audio/charJump.wav");
  /**
   * Audio for character getting hurt.
   * @type {HTMLAudioElement}
   */
  static CHARACTERHURT = new Audio("assets/audio/charHurt.wav");
  /**
   * Audio for character death.
   * @type {HTMLAudioElement}
   */
  static CHARACTERDEATH = new Audio("assets/audio/charDeath.wav");
  /**
   * Audio for throwing a stone.
   * @type {HTMLAudioElement}
   */
  static THROWSTONE = new Audio("assets/audio/throwStone.wav");
  /**
   * Audio for collecting a coin.
   * @type {HTMLAudioElement}
   */
  static COLLECTCOIN = new Audio("assets/audio/collectCoin.wav");
  /**
   * Audio for collecting a stone.
   * @type {HTMLAudioElement}
   */
  static COLLECTSTONE = new Audio("assets/audio/collectStone.wav");
  /**
   * Audio for Enemy 1 death.
   * @type {HTMLAudioElement}
   */
  static ENEMY1DEAD = new Audio("assets/audio/enemy1Dead.wav");
  /**
   * Audio for Enemy 2 death.
   * @type {HTMLAudioElement}
   */
  static ENEMY2DEAD = new Audio("assets/audio/enemy2Dead.wav");
  /**
   * Audio for endboss activation.
   * @type {HTMLAudioElement}
   */
  static ENDBOSS_ACTIVATION = new Audio("assets/audio/endbossContact.wav");
  /**
   * Audio for endboss stepping.
   * @type {HTMLAudioElement}
   */
  static ENDBOSS_STEP = new Audio("assets/audio/endbossStep.wav");
  /**
   * Audio for endboss getting hurt.
   * @type {HTMLAudioElement}
   */
  static ENDBOSS_HURT = new Audio("assets/audio/endbossHurt.wav");
  /**
   * Audio for endboss death.
   * @type {HTMLAudioElement}
   */
  static ENDBOSS_DEATH = new Audio("assets/audio/endbossDeath.wav");
  /**
   * Background music for the start screen.
   * @type {HTMLAudioElement}
   */
  static STARTSCREEN_MUSIC = new Audio("assets/audio/startScreen.wav");
  /**
   * Background music for the game.
   * @type {HTMLAudioElement}
   */
  static GAME_MUSIC = new Audio("assets/audio/gameMusic.wav");
  /**
   * Background music for the endboss fight.
   * @type {HTMLAudioElement}
   */
  static ENDBOSS_FIGHT = new Audio("assets/audio/endbossFight.wav");

  /**
   * Array containing all audio elements.
   * @type {HTMLAudioElement[]}
   */
  static allSounds = [
    AudioHub.CHARACTERWALK,
    AudioHub.CHARACTERJUMP,
    AudioHub.CHARACTERHURT,
    AudioHub.CHARACTERDEATH,
    AudioHub.THROWSTONE,
    AudioHub.COLLECTCOIN,
    AudioHub.COLLECTSTONE,
    AudioHub.ENEMY1DEAD,
    AudioHub.ENEMY2DEAD,
    AudioHub.THROWSTONE,
    AudioHub.ENDBOSS_ACTIVATION,
    AudioHub.ENDBOSS_STEP,
    AudioHub.ENDBOSS_HURT,
    AudioHub.ENDBOSS_DEATH,
    AudioHub.STARTSCREEN_MUSIC,
    AudioHub.GAME_MUSIC,
    AudioHub.ENDBOSS_FIGHT,
  ];

  /**
   * Indicates if all sounds are currently muted.
   * @type {boolean}
   */
  static isMuted = false;

  /**
   * Plays a single sound effect. If muted, the sound will not play.
   * Resets the current time to 0 before playing.
   * Uses a try-catch to handle potential play errors (e.g., user gesture required).
   * @param {HTMLAudioElement} sound - The audio element to play.
   */
  static playOneSound(sound) {
    if (AudioHub.isMuted) return;
    sound.volume = 0.2;
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  /**
   * Plays a sound effect in a loop. If muted, the sound will not play.
   * Sets the loop property to true and resets the current time to 0 before playing.
   * Uses a try-catch to handle potential play errors.
   * @param {HTMLAudioElement} sound - The audio element to play in a loop.
   */
  static playLoopingSound(sound) {
    if (AudioHub.isMuted) return;
    sound.volume = 0.05;
    sound.loop = true;
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  /**
   * Stops all currently playing sounds and resets their current time to 0.
   */
  static stopAllSounds() {
    AudioHub.allSounds.forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
    });
  }

  /**
   * Stops a specific sound effect and resets its current time to 0.
   * @param {HTMLAudioElement} sound - The audio element to stop.
   */
  static stopOneSound(sound) {
    sound.pause();
    sound.currentTime = 0;
  }

  /**
   * Stops the start screen music if it is playing and resets its current time to 0.
   */
  static stopStartScreenMusic() {
    if (AudioHub.STARTSCREEN_MUSIC) {
      AudioHub.STARTSCREEN_MUSIC.pause();
      AudioHub.STARTSCREEN_MUSIC.currentTime = 0;
    }
  }

  /**
   * Mutes or unmutes all sounds in the game.
   * @param {boolean} muted - A boolean indicating whether to mute (true) or unmute (false).
   */
  static muteAll(muted) {
    AudioHub.isMuted = muted;
    AudioHub.allSounds.forEach((sound) => {
      sound.muted = muted;
    });
  }
}
