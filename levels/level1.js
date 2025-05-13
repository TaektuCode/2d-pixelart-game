/**
 * @file Defines the function to build the first level of the game, including
 * enemies, clouds, background objects, collectables, and the end boss.
 */

/**
 * Builds and returns the first level of the game.
 * @returns {Level} The constructed level object.
 */
function buildLevel1() {
  return new Level(
    [new Endboss()],
    [
      new Enemy1(500),
      new Enemy1(800),
      new Enemy1(1100),
      new Enemy1(1400),
      new Enemy2(650),
      new Enemy2(950),
      new Enemy2(1250),
      new Enemy2(1550),
    ],
    [
      new Cloud("assets/img/clouds/clouds2.png", 0),
      new Cloud("assets/img/clouds/clouds2.png", 720),
      new Cloud("assets/img/clouds/clouds2.png", 720 * 2),
      new Cloud("assets/img/clouds/clouds2.png", 720 * 3),
      new Cloud("assets/img/clouds/clouds2.png", 720 * 4),
      new Cloud("assets/img/clouds/clouds2.png", 720 * 5),
      new Cloud("assets/img/clouds/clouds2.png", 720 * 6),
      new Cloud("assets/img/clouds/clouds2.png", 720 * 7),
    ],
    [
      new BackgroundObject("assets/img/background/sky.png", -720, 0),
      new BackgroundObject("assets/img/background/rocks.png", -720, 0),
      new BackgroundObject("assets/img/background/rocks2.png", -720, 0),
      new BackgroundObject("assets/img/background/rocks3.png", -720, 0),
      new BackgroundObject(
        "assets/img/background/ground_tile07.png",
        -720,
        340,
      ),
      new BackgroundObject("assets/img/background/sky.png", 0, 0),
      new BackgroundObject("assets/img/background/rocks.png", 0, 0),
      new BackgroundObject("assets/img/background/rocks2.png", 0, 0),
      new BackgroundObject("assets/img/background/rocks3.png", 0, 0),
      new BackgroundObject("assets/img/background/ground_tile07.png", 0, 340),
      new BackgroundObject("assets/img/background/sky.png", 720, 0),
      new BackgroundObject("assets/img/background/rocks.png", 720, 0),
      new BackgroundObject("assets/img/background/rocks2.png", 720, 0),
      new BackgroundObject("assets/img/background/rocks3.png", 720, 0),
      new BackgroundObject("assets/img/background/ground_tile07.png", 720, 340),
      new BackgroundObject("assets/img/background/sky.png", 720 * 2, 0),
      new BackgroundObject("assets/img/background/rocks.png", 720 * 2, 0),
      new BackgroundObject("assets/img/background/rocks2.png", 720 * 2, 0),
      new BackgroundObject("assets/img/background/rocks3.png", 720 * 2, 0),
      new BackgroundObject(
        "assets/img/background/ground_tile07.png",
        720 * 2,
        340,
      ),
      new BackgroundObject("assets/img/background/sky.png", 720 * 3, 0),
      new BackgroundObject("assets/img/background/rocks.png", 720 * 3, 0),
      new BackgroundObject("assets/img/background/rocks2.png", 720 * 3, 0),
      new BackgroundObject("assets/img/background/rocks3.png", 720 * 3, 0),
      new BackgroundObject(
        "assets/img/background/ground_tile07.png",
        720 * 3,
        340,
      ),
      new BackgroundObject("assets/img/background/sky.png", 720 * 4, 0),
      new BackgroundObject("assets/img/background/rocks.png", 720 * 4, 0),
      new BackgroundObject("assets/img/background/rocks2.png", 720 * 4, 0),
      new BackgroundObject("assets/img/background/rocks3.png", 720 * 4, 0),
      new BackgroundObject(
        "assets/img/background/ground_tile07.png",
        720 * 4,
        340,
      ),
    ],
    [
      new CollectableObjects(200, 300),
      new CollectableObjects(200 * 3, 300),
      new CollectableObjects(200 * 4, 300),
      new CollectableObjects(200 * 4.5, 300),
      new CollectableObjects(200 * 7, 300),
    ],
    [
      new CollectableStone(250, 350),
      new CollectableStone(250 * 1.5, 350),
      new CollectableStone(250 * 4, 350),
      new CollectableStone(250 * 4.5, 350),
      new CollectableStone(250 * 7, 350),
      new CollectableStone(250 * 8, 350),
    ],
  );
}
