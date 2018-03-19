
// very specific
class Bullet extends Projectile {

  constructor(swarm, x, y, direction, directionalOffset) {
    super(
      swarm,
      '@bullet',
      resources.rk.texture,
      x + (directionalOffset ? Math.sin(direction)*directionalOffset : 0),
      y + (directionalOffset ? Math.cos(direction)*directionalOffset : 0),
      direction,
      1000
    );

    world.children.forEach((a,i) => {
      if ( a instanceof Entity && a!=player ) this.collider.addToDetectionPool(a);
    });

    this.scale.set(0.3, 0.3);
    this.collider.updateSize();
    this.sprite.rotation = PI;
    this.collider.debug(false);
    this.collider.collided = (t, dx, dy, ang) => {
      this.destroy();
    }
  }
}
