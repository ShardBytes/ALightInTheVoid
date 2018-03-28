// by Plasmoxy
// a very specific Bullet projectile for players

class Bullet extends Projectile {

  constructor(swarm, emmiter, x, y, direction, isFake, directionalOffset) {
    super(
      swarm,
      emmiter,
      '@bullet',
      resources.bluelaser.texture,
      x + (directionalOffset ? Math.sin(direction)*directionalOffset : 0),
      y + (directionalOffset ? Math.cos(direction)*directionalOffset : 0),
      direction,
      1000
    );
    this.sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST; // pixel mode
    this.damage = 4;
    this.deathTime = 1.5; // 1.5 sec life
    this.isFake = isFake; // if its fake, it will be harmless

    // add all objects in the world as colliders, except the emmiter of course and some others
    world.children.forEach((a,i) => {
      if (
        a instanceof Entity &&
        a != emmiter &&
        a != safarik
      )this.collider.addToDetectionPool(a);
    });

    this.sprite.scale.set(0.5, 0.5);
    this.collider.ro = 5; // radius offset
    this.collider.updateSize();
    //this.collider.r = 10; // fixed collider radius
    this.sprite.rotation = PI;
    this.collider.debug(COLLIDER_DEBUG);
    this.collider.collided = (t, dx, dy, ang) => {
      // hit player if not fake
      if (!this.isFake && t instanceof Player) {
        t.hit(this.damage);
      }

      // play hit sound
      resources.hit.sound.play();

      // destroy this bullet on hit
      this.destroy();
    }
  }

  destroy() {
    // show destroy animation
    new Apparition(world, 'expl_', '.png', 6, this.x, this.y, 0.2, 0.2);
    super.destroy();
  }

  update(dt) {
    super.update(dt);
    let cr = this.collider.r;

    // if outside the world, destroy
    if ( this.x >= world.w/2 - cr || this.x <= -world.w/2 + cr || this.y >= world.h/2 - cr || this.y <= -world.h/2 + cr) {
      this.destroy(); // just destroy, dont hit
      return;
    }
  }
}
