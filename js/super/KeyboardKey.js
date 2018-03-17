/* Keyboard key detection class by Plasmoxy */

class KeyboardKey {
  constructor(keyCode) {
    this.code = keyCode;
    this.down = false;

    /* these ought to be overridden */
    this.press = undefined;
    this.release = undefined;

    window.addEventListener(
      'keydown', this.downHandler.bind(this), false
    );

    window.addEventListener(
      'keyup', this.upHandler.bind(this), false
    );
  }

  downHandler(event) {
    if (event.keyCode === this.code) {
      if (!this.down && this.pressed) this.pressed();
      this.down = true;
    }

    /* prevent all handlers except some imporant ones */
    switch (event.keyCode) {
      case 122: break; // f5 - reset
      case 116: break; // f11 - fullscreen
      case 27: break; // esc - exit
      case 123: break; // f12 - devtools
      default:
        event.preventDefault();
    }
  }

  upHandler(event) {
    if (event.keyCode === this.code) {
      if (this.down && this.released) this.released();
      this.down = false;
    }
  }
}
