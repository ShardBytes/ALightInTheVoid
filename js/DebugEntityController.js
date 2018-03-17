/* Simple entity debug controller by Plasmoxy */

class DebugEntityController {

  constructor(mkeys, targetentity, movespeed) {
    this.k = mkeys;
    this.t = targetentity;
    this.ms = movespeed;
  }

  update(dt) {
    let d = dt*this.ms;
    if (this.k.up.down) this.t.y -= d;
    if (this.k.down.down) this.t.y += d;
    if (this.k.left.down) this.t.x -= d;
    if (this.k.right.down) this.t.x += d;
  }
}
