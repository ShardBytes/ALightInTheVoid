// Mobile device controller by Plasmoxy

class MobileController extends Container {

  constructor() {
    super();
    this.mode = 1;// mobile mode

    // the magical empty lambdas keep the not a function errors away ;)
    this.up = {down: false, released: () => {}, pressed: () => {}};
    this.down = {down: false, released: () => {}, pressed: () => {}};
    this.left = {down: false, released: () => {}, pressed: () => {}};
    this.right = {down: false, released: () => {}, pressed: () => {}};
    this.shoot = {down: false, released: () => {}, pressed: () => {}};
    this.boost = {down: false, released: () => {}, pressed: () => {}};

    this.leftPad = new Sprite(resources.bootlegpad.texture);
    this.leftPad.anchor.set(0, 1); // bottom left corner, this is just to align the sprite
    this.addChild(this.leftPad);
    this.align();

    // IMPORTANT: bind the function to this controller so it doesn't use the document as 'this'
    // also this made me rage quit when it didn't work because i didn't know about bind lol
    document.addEventListener("touchstart", this.handleStart.bind(this), false);
    document.addEventListener("touchend", this.handleEnd.bind(this), false);
    document.addEventListener("touchmove", this.handleMove.bind(this), false);

  }

  //x,y -> relative to bottom left corner of pad
  // pad -> bottom left, 300x300
  getLeftPadButton(touch) {
    let x = touch.pageX - this.leftPad.position.x, y = this.leftPad.position.y - touch.pageY; // relative x,y
    let btnx = 0, btny = 0;

    if (x > 300 || y > 300) return 'XX'; // if the touch is outside pad

    if (y <= 100) btny = 1; // bottom
    if (y > 100 && y <= 200) btny = 2; // mid
    if (y > 200 && y <= 300) btny = 3; // top

    if (x <= 100) btnx = 1; // left
    if (x > 100 && x <= 200) btnx = 2; // mid
    if (x > 200 && x <= 300) btnx = 3; // right

    return '' + btnx + btny; // return in 2 char format

  }

  handleStart(e) { // link to move as they're the positive touches
    e.preventDefault();
    this.handleMove(e);
  }

  handleMove(e) {
    e.preventDefault();
    let ts = e.changedTouches;
    for (let i = 0; i<ts.length; i++) {
      let lpadb = this.getLeftPadButton(ts[i]);
      console.log(lpadb);
      // check y buttons

      if (lpadb[1] == '3' && !this.up.down) {
        this.up.down = true; this.up.pressed();
        this.down.down = false; this.down.released();
      } else if (lpadb[1] == '1' && !this.down.down) {
        this.down.down = true; this.down.pressed();
        this.up.down = false; this.up.released();
      } else if (lpadb[1] == '2') { // if in middle
        this.down.down = false; this.down.released();
        this.up.down = false; this.up.released();
      }

      // check x buttons

      if (lpadb[0] == '3' && !this.right.down) {
        this.right.down = true; this.right.pressed();
        this.left.down = false; this.left.released();
      } else if (lpadb[0] == '1' && !this.left.down) {
        this.left.down = true; this.left.pressed();
        this.right.down = false; this.right.released();
      } else if (lpadb[0] == '2') { // if in middle
        this.left.down = false; this.left.released();
        this.right.down = false; this.right.released();
      }

    }
  }

  handleEnd(e) { // negative touch
    e.preventDefault();
    let ts = e.changedTouches;
    for (let i = 0; i<ts.length; i++) {
      let lpadb = this.getLeftPadButton(ts[i]);
      if (lpadb != 'XX') { // if ended in pad, release all
        this.down.down = false; this.down.released();
        this.up.down = false; this.up.released();
        this.left.down = false; this.left.released();
        this.right.down = false; this.right.released();
      }
    }
  }

  align() {
    this.leftPad.position.y = app.renderer.height;
  }

}
