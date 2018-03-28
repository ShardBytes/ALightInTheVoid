
// todo coment

class Projectile extends DirectionalEntity {

  constructor(superContainer, emmiter, genericId, texture, x, y, direction, speed) {
    super(genericId, texture);
    this.emmiter = emmiter;

    this.x = x;
    this.y = y;

    this.direction = direction;
    this.speed = speed;
    this.sc = superContainer;

    this.collider = new CircleCollider(this);

    this.deathTime = 2; // seconds, will destroy when reaching death ;_;
    this.lifeTime = 0; // seconds

  }

  destroy() {
    if (this.sc.children.includes(this)) this.sc.removeChild(this);
  }

  update(dt) {
    super.update(dt);
    this.rotateToDirection();
    this.move(dt);
    this.lifeTime += (dt/60);
    if (this.lifeTime >= this.deathTime) {
      this.destroy();
    }
  }

}
