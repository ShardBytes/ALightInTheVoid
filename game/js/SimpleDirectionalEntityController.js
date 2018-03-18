
class SimpleDirectionalEntityController {

  constructor(mkeys, targetentity, movespeed) {
    this.k = mkeys;
    this.t = targetentity;
    this.ms = movespeed; // [px per sec]
    this.rs = Math.PI; // rotation speed [rad per sec]

    this.k.up.pressed = () => this.t.speed = this.ms;
    this.k.up.released = () => this.t.speed = 0;

    this.k.down.pressed = () => this.t.speed = -this.ms;
    this.k.down.released = () => this.t.speed = 0;
  }

  update(dt) {
    let dr = this.rs*(dt/60);

    if (this.k.left.down) this.t.direction += dr;
    if (this.k.right.down) this.t.direction -= dr;
  }

}
