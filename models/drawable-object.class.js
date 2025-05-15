/**
 * @file Defines the DrawableObject class, which serves as a base class for
 * objects that can be drawn on the canvas, such as characters, enemies, and
 * background elements. It handles image loading and drawing, including
 * flipping the image horizontally based on the `otherDirection` property.
 */

/**
 * Represents an object that can be drawn on the canvas.
 */
class DrawableObject {
  /**
   * The HTML Image element to be drawn.
   * @type {HTMLImageElement}
   */
  img;
  /**
   * The x-coordinate of the object on the canvas.
   * @type {number}
   */
  x = 120;
  /**
   * The y-coordinate of the object on the canvas.
   * @type {number}
   */
  y = 325;
  /**
   * The width of the object when drawn on the canvas.
   * @type {number}
   */
  width = 200;
  /**
   * The height of the object when drawn on the canvas.
   * @type {number}
   */
  height = 150;
  /**
   * An object to cache loaded images, with the path as the key and the Image object as the value.
   * @type {Object.<string, HTMLImageElement>}
   */
  imageCache = {};
  /**
   * The index of the current image to be displayed, used for animations.
   * @type {number}
   */
  currentImage = 0;
  /**
   * A boolean indicating if the object should be drawn facing the other direction (horizontally flipped).
   * @type {boolean}
   */
  otherDirection = false;

  /**
   * Loads a single image and sets it as the `img` property of the DrawableObject.
   * @param {string} path - The path to the image file.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Loads multiple images from an array of paths and stores them in the `imageCache`.
   * @param {string[]} arr - An array of image paths.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Draws the object on the canvas context. Handles horizontal flipping based on `this.otherDirection`.
   * Only draws the image if it is loaded (`this.img.complete`).
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
   */
  draw(ctx) {
    if (this.img && this.img.complete) {
      if (this.otherDirection) {
        ctx.save();
        ctx.translate(this.x + this.width - 50, this.y);
        ctx.scale(-1, 1);
        ctx.drawImage(this.img, 0, 0, this.width, this.height);
        ctx.restore();
      } else {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      }
    }
  }
}
