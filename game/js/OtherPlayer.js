
// OtherPlayer class by Plasmoxy
// this is like a mannequin, it moves around and shoots fake projectiles
// (self hit checking will be done on client to improve authenticity)

class OtherPlayer extends SegmentedTargetEntity {

  constructor(container, id, x, y, team) {
    super(id, resources.rk.texture, x, y);
    this.superContainer = container;
    this.alive = false;

    this.scale.set(0.5, 0.5);
    this.sprite.rotation = PI;
    this.collider = new BoxCollider(this);

    this.team = team;

    this.shooting = false; // this is to be updated by socket
    this.deltaShoot = 0; // in seconds
    this.fireRate = 10; // 3 per second
  }

  interpolate(dt) {
    this.move(dt, INTERP_RATIO);
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
          // shoot a fake bullet
          bullets.addChild(
            new Bullet(bullets, this, this.x, this.y, this.rotation, true)
          );
        }
      }
      this.deltaShoot += (dt/60);
    }
  }

}
