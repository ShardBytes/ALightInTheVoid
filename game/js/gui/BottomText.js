
class BottomText extends Text {

  constructor(loc, text) {
    super(text, {
      fontFamily : 'Consolas, Arial',
      fontSize: 15,
      fill : 0xffffff,
      fontWeight: 'bold',
      align : 'center'
    });
    this.loc = loc;// location => 1 - left, 2 - mid, 3 - right
    this.offset = 7;
    this.align();
  }

  align() {
    if (this.loc == 1) {
      this.anchor.set(0, 1);
      this.style.align = 'left';
      this.position.x = this.offset;
    } else if ( this.loc == 2) {
      this.anchor.set(0.5, 1);
      this.style.align = 'center';
      this.position.x = app.renderer.width/2;
    } else if ( this.loc == 3) {
      this.anchor.set(1, 1);
      this.style.align = 'right';
      this.position.x = app.renderer.width - this.offset;
    }
    this.position.y = app.renderer.height - this.offset; // go to bottom

  }

}
