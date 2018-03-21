
// OtherPlayer class by Plasmoxy
// this is like a mannequin, it moves around and shoots bullets
// (self hit checking will be done on clients to improve authenticity)
// this can HURT the player - therefore player is hit only if someone else hits him with hi bullets

class OtherPlayer extends SegmentedTargetEntity {

  constructor(container, id, spawnX, spawnY, team) {
    super(id, team == '1' ? resources.cyanplayer.texture : resources.orangeplayer.texture , spawnX, spawnY);
    this.superContainer = container;
    this.alive = false;

    this.spawnX = spawnX;
    this.spawnY = spawnY;

    this.scale.set(0.5, 0.5);
    this.sprite.rotation = PI;
    this.collider = new BoxCollider(this);
    this.collider.debug(false);

    this.team = team;

    this.shooting = false; // this is to be updated by socket
    this.deltaShoot = 0; // in seconds
    this.fireRate = 10; // bullets per second
  }

  interpolate(dt) {
    this.move(dt, INTERP_RATIO);
  }

  spawn() { // same as Player
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.tx = this.x;
    this.ty = this.y;
    this.rotation = PI;
    if (!this.superContainer.children.includes(this)) this.superContainer.addChild(this);
    this.alive = true;
  }

  despawn() { // same as Player
    this.alive = false;
    if (this.superContainer.children.includes(this)) this.superContainer.removeChild(this);
    // show despawn animation
    new Apparition(world, 'expl', 5, this.x, this.y, 0.8, 0.2);
  }

  update(dt) {
    if (this.alive) {
      super.update(dt);

      // handle fake shooting
      if (this.deltaShoot > 1.0/this.fireRate) {
        this.deltaShoot = 0;
        if (this.shooting) {
          // shoot a damaging bullet, -rotation because of different logic between direction and rotation ( d=2pi-r)
          // some wild trigonometry to we can shoot 2 bullets, duh
          bullets.addChild(new Bullet(bullets, this, this.x + 10*Math.cos(-this.rotation), this.y - 10*Math.sin(-this.rotation), -this.rotation, false));
          bullets.addChild(new Bullet(bullets, this, this.x - 10*Math.cos(-this.rotation), this.y + 10*Math.sin(-this.rotation), -this.rotation, false));
        }
      }
      this.deltaShoot += (dt/60);
    }
  }

}
