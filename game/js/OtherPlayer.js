
class OtherPlayer extends Entity {

  constructor(container, id, x, y, team) {
    super(id, resources.rk.texture);
    this.superContainer = container;
    this.x = x;
    this.y = y;
    this.alive = false;

    this.scale.set(0.5, 0.5);
    this.sprite.rotation = PI;
    this.collider = new BoxCollider(this);

    this.tx = x; // target x
    this.ty = y; // target y
    this.team = team;

    this.shooting = true; // this is to be updated by socket
    this.deltaShoot = 0; // in seconds
    this.fireRate = 10; // 3 per second
  }

  interpolate(dt) {
    this.x += (this.tx - this.x) * dt * INTERP_RATIO;
    this.y += (this.ty - this.y) * dt * INTERP_RATIO;
  }

  spawn() { // same as Player
    if (!this.superContainer.children.includes(this)) this.superContainer.addChild(this);
    this.alive = true;
  }

  despawn() { // same as Player
    this.alive = false;
    if (this.superContainer.children.includes(this)) this.superContainer.removeChild(this);
  }

  update(dt) {
    if (this.alive) {
      super.update(dt);

      // handle fake shooting
      if (this.deltaShoot > 1.0/this.fireRate) {
        this.deltaShoot = 0;
        if (this.shooting) {

          bullets.addChild(
            new Bullet(bullets, this, this.x, this.y, this.rotation, true)
          );

        }
      }
      this.deltaShoot += (dt/60);
    }
  }

}
