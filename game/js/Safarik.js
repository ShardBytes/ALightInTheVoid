
class Safarik extends Entity {

  constructor() {
    super('safarik', resources.safarik.texture);
    this.collider = new BoxCollider(this, 200, 200);
    this.scale.set(0.5, 0.5);
    this.collider.updateSize();
    this.collider.debug(true);
  }

}
