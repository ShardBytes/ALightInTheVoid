// FollowerCamera by Plasmoxy
// this is a Camera with functionality of SegmentedTargetEntity

class FollowerCamera extends Camera  {

  constructor(c, followRatio) {
    super(c);
    this.ratio = followRatio;
  }

  follow(dt, target) {
    this.c.pivot.x += (target.x - this.x) * dt * this.ratio;
    this.c.pivot.y += (target.y - this.y) * dt * this.ratio;
  }

}
