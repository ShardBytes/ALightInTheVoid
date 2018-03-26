// Mobile device controller by Plasmoxy

/* ACHTUNG : this is broken code, currently in development */
/* this class should be unlinked at this moment */
/* the key pressed() function event is not triggering for some reason, one solution would be to
 * rework player to work use its own triggering but that would be a lot of job so nvm
 * i haven't got time for that, sadly
*/


class MobileController extends Container {

  constructor() {
    super();
    this.mode = 1;// mobile mode

    this.up = {down: false};
    this.down = {down:false};
    this.left = {down:false};
    this.right = {down:false};
    this.shoot = {down:false};
    this.boost = {down:false};

    this.pad = new Sprite(resources.bootlegpad.texture);
    this.pad.anchor.set(0, 1); // bottom left corner, this is just to align the sprite
    this.addChild(this.pad);
    this.align();

    document.addEventListener("touchstart", this.handleStart, false);
    document.addEventListener("touchend", this.handleEnd, false);
    document.addEventListener("touchcancel", this.handleCancel, false);
    document.addEventListener("touchmove", this.handleMove, false);

  }

  //x,y -> relative to bottom left corner of pad
  getPadButton(touch) {
    let x = touch.pageX - this.pad.position.x, y = this.pad.position.y - touch.pageY; // relative x,y
    let btnx = 0, btny = 0;

    if (y <= 100) btny = 1; // bottom
    if (y > 100 && y <= 200) btny = 2; // mid
    if (y > 200 && y <= 300) btny = 3; // top

    if (x <= 100) btnx = 1; // left
    if (x > 100 && x <= 200) btnx = 2; // mid
    if (x > 200 && x <= 300) btnx = 3; // right

    return '' + btnx + btny; // return in 2 char format

  }

  handleStart(e) {
    e.preventDefault();
    let ts = e.changedTouches;
    let padb = controller.getPadButton(ts[0]);

    // x button
    switch(padb[0]) {
      case '1':
        controller.left.down = true;
        break;
      case '2':
        controller.left.down = false;
        controller.right.down = false;
        break;
      case '3':
        controller.right.down = true;
        break;
    }

    // y button
    switch(padb[1]) {
      case '1':
        controller.down.pressed();
        break;
      case '3':
        if (controller.up.pressed) controller.up.pressed(); // DOES NOT TRIGGER THE EVENT ? IS OBJECT SCOPE BROKEN ? WTF...
        break;
    }
  }

  handleEnd(e) {

  }

  align() {
    this.pad.position.y = app.renderer.height;
  }

}
