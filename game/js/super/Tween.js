// Tween (value animator) class by Plasmoxy
// this is just sooo amazing. it can animate any value. wow.
// i'll leave it to linear for window

class Tween {

  constructor(property, speed) {
    this.p = property; // property to influence
    this.s = speed; // speed of change [unit per second]

    this.target = p; // target
  }

  update(dt) {
    let d = this.s*(dt/60);

    // round property to target when there is minimal difference
    // this is important because the we're working with decimal numbers
    // and it could happen that we'd never reach the target precisely
    if (this.p > this.target - d && this.p < this.target + d) this.p = this.target;

    if (this.p < this.target) this.p += d;
    else if(this.p > this.target) this.p -= d;
  }

}
