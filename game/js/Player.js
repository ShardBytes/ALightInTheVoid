
class Player extends DirectionalEntity {

  constructor(id) {
    super(id, resources.rk.texture);
    this.collider = new BoxCollider(this);

    this.position.set(0, -300);
    this.scale.set(0.5, 0.5);
    this.collider.updateSize();
    this.sprite.rotation = PI;
    
    this.collider.debug(dbg);
  }

  update(dt) {
    this.move(dt);
    this.rotateToDirection();
  }

}
