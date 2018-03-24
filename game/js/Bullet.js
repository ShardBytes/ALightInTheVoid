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
    this.damage = 3;
    this.isFake = isFake; // if its fake, it will be harmless

    // add all objects in the world as colliders, except the emmiter of course and some others
    world.children.forEach((a,i) => {
      if (
        a instanceof Entity &&
        a != emmiter &&
        a != safarik
      )this.collider.addToDetectionPool(a);
    });

    this.scale.set(0.5, 0.5);
    this.collider.updateSize();
    this.sprite.rotation = PI;
    this.collider.debug(false);
    this.collider.collided = (t, dx, dy, ang) => {
      // TODO : hit player if not fake
      if (!this.isFake && t instanceof Player) {
        t.hit(this.damage);
      }
      // show hit animation
      new Apparition(world, 'expl', 6, this.x, this.y, 0.2, 0.2);
      // play hit sound
      resources.hit.sound.play();
      // destroy this bullet on hit
      this.destroy();
    }
  }
}
