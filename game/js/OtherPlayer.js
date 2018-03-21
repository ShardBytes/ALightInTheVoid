
// OtherPlayer class by Plasmoxy
// this is like a mannequin, it moves around and shoots fake projectiles
// (self hit checking will be done on clients to improve authenticity)
// this doesn't emit any events, it's just a mannequin

class OtherPlayer extends SegmentedTargetEntity {

  constructor(container, id, spawnX, spawnY, team) {
    super(id, resources.rk.texture, spawnX, spawnY);
    this.superContainer = container;
    this.alive = false;

    this.spawnX = spawnX;
    this.spawnY = spawnY;

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
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.tx = this.x;
    this.ty = this.y;
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
          // shoot a fake bullet, -rotation because of different logic between direction and rotation ( d=2pi-r)
          bullets.addChild(
            new Bullet(bullets, this, this.x, this.y, -this.rotation, true)
          );
        }
      }
      this.deltaShoot += (dt/60);
    }
  }

}
