// simple energy and health orb by Plasmoxy

class Orb extends Entity {

  // mode: 0 = energy, 1 = health
  constructor(mode, x, y) {
    super('@orb', mode == 0 ? resources.energypowerup.texture : resources.healthpowerup.texture );
    this.sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST; // pixel mode
    this.sprite.scale.set(2,2);
    this.x = x;
    this.y = y;

    this.collider = new CircleCollider(this);
    this.collider.debug(COLLIDER_DEBUG);

    this.collider.collided = (t, dx, dy, ang) => {
      if (t instanceof Player) {
        if (mode == 0) player.energy += 20;
        else player.health += 20;
        player.checkOverStock();
        resources.powerup.sound.play();
        this.reload();
      } else if ( t instanceof OtherPlayer) this.reload();
    };
  }


  reload() {
    this.setActive(false);
    setTimeout(()=>{this.setActive(true)}, 10000);
  }

  setActive(active) {
    this.collider.active = active;
    this.visible = active;
  }

}
