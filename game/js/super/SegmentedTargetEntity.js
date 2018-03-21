
// by Plamsmoxy
// this Entity moves smoothly (ease out) to the target, which can be constantly changing
// by calling move(..) it moves to the position considering specified ratio
// ratio -> if this is big, it will quickly move to the target
// with small ratio, it moves smoother but is more "behind" the target
// this can act as interpolation, only it is a bit behind, but with low ping it's not so significant.
// -> by shooting position segments to it, it will fill the positions between segments

class SegmentedTargetEntity extends Entity {

  constructor(id, texture, x, y) {
    super(id, texture);

    this.x = x;
    this.y = y;

    // target position, this is meant to be frequently changed
    this.tx = x;
    this.ty = y;
  }

  move(dt, ratio) {
    this.x += (this.tx - this.x) * dt * ratio;
    this.y += (this.ty - this.y) * dt * ratio;
  }

}
