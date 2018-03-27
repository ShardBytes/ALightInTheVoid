// simple keyboard controls by Plasmoxy

class KeyboardController {

  constructor() {
    this.mode = 0; // 0 for pc, 1 for mobile
    this.up = new KeyboardKey(38); // up arrow
    this.down = new KeyboardKey(40); // down arrow
    this.left = new KeyboardKey(37); // left arrow
    this.right =  new KeyboardKey(39); // right arrow
    this.shoot = new KeyboardKey(82); // R
    this.boost = new KeyboardKey(81); // Q
  }

}
