/**
 * @file Defines the Keyboard class, which holds the state of the currently
 * pressed keyboard keys relevant to the game controls. Each property represents
 * a specific key and is a boolean indicating whether that key is currently pressed.
 */

/**
 * Represents the current state of relevant keyboard keys.
 */
class Keyboard {
  /**
   * True if the left arrow key is pressed, false otherwise.
   * @type {boolean}
   */
  LEFT = false;
  /**
   * True if the right arrow key is pressed, false otherwise.
   * @type {boolean}
   */
  RIGHT = false;
  /**
   * True if the up arrow key is pressed, false otherwise.
   * @type {boolean}
   */
  UP = false;
  /**
   * True if the down arrow key is pressed, false otherwise.
   * @type {boolean}
   */
  DOWN = false;
  /**
   * True if the spacebar is pressed, false otherwise (used for jumping).
   * @type {boolean}
   */
  SPACE = false;
  /**
   * True if the 'D' key is pressed, false otherwise (used for throwing).
   * @type {boolean}
   */
  D = false;
}
