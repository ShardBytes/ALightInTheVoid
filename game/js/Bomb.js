
class Bomb extends Entity {

  constructor(swarm, x, y, directionalOffset) {
    super('@bomb', resources.healthpowerup.texture );
    this.sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST; // pixel mode
    this.sprite.scale.set(2,2);
    this.x = x;
    this.y = y;
    this.swarm =

    this.collider = new CircleCollider(this);
    this.collider.debug(COLLIDER_DEBUG);

    this.collider.addToDetectionPool(player);

    this.collider.collided = (t, dx, dy, ang) => {
      if (t instanceof Player) {

      }
    };
  }

  destroy() {
    this.
  }

}
