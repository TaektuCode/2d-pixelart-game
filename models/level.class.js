class Level {
  endboss;
  enemies;
  clouds;
  backgroundObjects;
  collectables;
  collectableStone;
  level_end_x = 2500;

  constructor(
    endboss,
    enemies,
    clouds,
    backgroundObjects,
    collectables,
    collectableStone,
  ) {
    this.endboss = endboss;
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.collectables = collectables;
    this.collectableStone = collectableStone;
  }
}
