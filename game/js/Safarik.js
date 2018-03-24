
class Safarik extends SegmentedTargetEntity {

  constructor() {
    super('safarik', resources.safarik.texture, 0, 0);

    this.scale.set(0.5, 0.5);
    this.collider = new BoxCollider(this, 200, 200);
    this.collider.updateSize();
    this.collider.debug(true);
  }

  update(dt) {
    super.update(dt);
    this.move(dt, INTERP_RATIO);
  }

}
