class Level {
  enemies;
  clouds;
  backgroundObjects;
  collectables;
  collectableStone;
  level_end_x = 2500;

  constructor(
    enemies,
    clouds,
    backgroundObjects,
    collectables,
    collectableStone,
  ) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.collectables = collectables;
    this.collectableStone = collectableStone;
  }
}
