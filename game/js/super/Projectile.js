
// todo coment

class Projectile extends DirectionalEntity {

  constructor(swarm, genericId, texture, x, y, direction, speed) {
    super(genericId, texture);

    this.direction = direction;
    this.speed = speed;
    this.swarm = swarm;

    this.collider = new BoxCollider(this);

  }

  destroy() {
    this.swarm.removeChild(this);
  }

  update(dt) {
    super.update(dt);
    this.rotateToDirection();
    this.move(dt);
  }

}
