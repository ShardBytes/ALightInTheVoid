/* Simple entity debug controller by Plasmoxy */

class SimpleEntityController {

  constructor(mkeys, targetentity, movespeed) {
    this.k = mkeys;
    this.t = targetentity;
    this.ms = movespeed; // [px per sec]
  }

  update(dt) {
    let d = this.ms*(dt/60);
    if (this.k.up.down) this.t.y -= d;
    if (this.k.down.down) this.t.y += d;
    if (this.k.left.down) this.t.x -= d;
    if (this.k.right.down) this.t.x += d;
  }
}
