class Bullet extends Projectile {

  constructor(swarm, destroyers, x, y, direction) {
    super(swarm, '@bullet', resources.rk.texture, x, y, direction, 1000);
    this.scale.set(0.3, 0.3);
    this.collider.updateSize();
    this.sprite.rotation = PI;
    this.collider.debug(true);
    destroyers.forEach((a,i) => {
      this.collider.addToDetectionPool(a);
    });
    this.collider.collided = (t, dx, dy, ang) => {
      this.destroy();
    }
  }
}
