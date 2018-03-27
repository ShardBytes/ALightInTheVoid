// FollowerCamera by Plasmoxy
// this is a Camera with functionality of SegmentedTargetEntity
// except it is not using dt as we're updating graphics, not movement and it
// would be laggy.

class FollowerCamera extends Camera  {

  constructor(c, followRatio) {
    super(c);
    this.ratio = followRatio;
  }

  follow(target) {
    this.c.pivot.x += (target.x - this.x) * this.ratio;
    this.c.pivot.y += (target.y - this.y) * this.ratio;
  }

}
