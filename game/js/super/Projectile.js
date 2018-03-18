
// todo coment

class Projectile extends DirectionalEntity {

  constructor(swarm, genericId, texture, x, y, direction, speed) {
    super(genericId, texture);

    this.x = x;
    this.y = y;

    this.direction = direction;
    this.speed = speed;
    this.swarm = swarm;

    this.collider = new BoxCollider(this);

    this.deathTime = 2; // seconds, will destroy when reaching death ;_;
    this.lifeTime = 0; // seconds

  }

  destroy() {
    this.swarm.removeChild(this);
  }

  update(dt) {
    super.update(dt);
    this.rotateToDirection();
    this.move(dt);
    this.lifeTime += (dt/60) ;
    if (this.lifeTime >= this.deathTime) {
      this.destroy();
    }
  }

}
