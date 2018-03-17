/* Simple entity debug controller by Plasmoxy */

class SimpleDynamicEntityController {

  constructor(mkeys, targetentity, movespeed) {
    this.k = mkeys;
    this.t = targetentity;
    this.ms = movespeed;

    this.k.up.pressed = () => { this.t.v.y -= this.ms; };
    this.k.up.released = () => { this.t.v.y = 0; };

    this.k.down.pressed = () => { this.t.v.y += this.ms; };
    this.k.down.released = () => { this.t.v.y = 0; };

    this.k.left.pressed = () => { this.t.v.x -= this.ms; };
    this.k.left.released = () => { this.t.v.x = 0; };

    this.k.right.pressed = () => { this.t.v.x += this.ms; };
    this.k.right.released = () => { this.t.v.x = 0; };

  }
}
