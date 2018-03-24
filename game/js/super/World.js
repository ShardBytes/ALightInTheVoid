/* just extend this because of typeness m8 */

class World extends Container {

  constructor(w, h) {
    super();
    this.w = w;
    this.h = h;
    this.gr = new PIXI.Graphics;
    this.addChild(this.gr);
  }

  drawBorder() {
    this.gr.lineStyle(2, 0xFFFFFF, 1);
    this.gr.drawRect(-this.w/2, -this.h/2, this.w, this.h);
  }

}
