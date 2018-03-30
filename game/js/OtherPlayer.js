
// OtherPlayer class by Plasmoxy
// this is like a mannequin, it moves around and shoots bullets
// (self hit checking will be done on clients to improve authenticity)
// this can HURT the player - therefore player is hit only if someone else hits him with hi bullets

class OtherPlayer extends SegmentedTargetEntity {

  constructor(container, id, spawnX, spawnY, team) {
    super(id, team == '1' ? resources.cyanplayer.texture : resources.orangeplayer.texture , spawnX, spawnY);
    this.sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST; // pixel mode
    this.sprite.scale.set(2, 2);
    this.superContainer = container;
    this.alive = false;

    this.spawnX = spawnX;
    this.spawnY = spawnY;

    this.inSpawn = false; // if the otherplayer is in spawn

    this.collider = new CircleCollider(this);
    this.collider.r = 15;
    this.collider.debug(COLLIDER_DEBUG);
    // add spawns to detection pool
    this.collider.addToDetectionPool(spawn1);
    this.collider.addToDetectionPool(spawn2);
    this.collider.collided = (t, dx, dy, ang) => {
      if (t instanceof Spawn) this.inSpawn = true;
    };
    this.collider.discollided = (t, dx, dy, ang) => {
      if (t instanceof Spawn) this.inSpawn = false;
    };

    this.team = team;

    // add fire Apparition
    this.fireApparition = new Apparition(this, 'fire_', '.png', 4, 3, -25, 0.08, 0.5, true);
    this.fireApparition.visible = false;

    // add boost Apparition
    this.boostApparition = new Apparition(this, 'boostparticles ', '.aseprite', 20, 0, 0, 2, 0.5, true, true);
    this.boostApparition.rotation = Math.PI;
    this.boostApparition.visible = false;

    // add name text
    this.nameText = new PlayerNameText(this);

  }

  interpolate(dt) {
    this.move(dt, INTERP_RATIO);
  }

  spawn() { // same as Player
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.tx = this.x;
    this.ty = this.y;
    this.rotation = (this.team == '1') ? -PI/2 : PI/2; // inverse because of inverse angle logic
    if (!this.superContainer.children.includes(this)) this.superContainer.addChild(this);
    this.alive = true;

    // add player text
    if (!world.children.includes(this.nameText)) world.addChild(this.nameText);
  }

  despawn() { // same as Player
    this.alive = false;
    if (this.superContainer.children.includes(this)) this.superContainer.removeChild(this);
    // show despawn animation
    new Apparition(world, 'expl_', '.png', 6, this.x, this.y, 1, 0.2);
    // play despawn sound
    resources.explosionsound.sound.play();

    // remove player text
    if (world.children.includes(this.nameText)) world.removeChild(this.nameText);
  }

  update(dt) {
    if (this.alive) {
      super.update(dt); // update superclass
      this.nameText.update(); // update name text
    }
  }

  shoot() {
    // shoot a damaging bullet, -rotation because of different logic between direction and rotation ( d=2pi-r)
    // some wild trigonometry so we can shoot 2 bullets, duh
    new Bullet(bullets, this, this.x + 10*Math.cos(-this.rotation), this.y - 10*Math.sin(-this.rotation), -this.rotation, false);
    new Bullet(bullets, this, this.x - 10*Math.cos(-this.rotation), this.y + 10*Math.sin(-this.rotation), -this.rotation, false);
  }

  flash(tx, ty) {
    this.visible = false;
    new Apparition(world, 'expl_', '.png', 6, this.x, this.y, 1, 0.2);

    this.x = this.tx = tx;
    this.y = this.ty = ty;

    new Apparition(world, 'expl_', '.png', 6, this.x, this.y, 1, 0.2);
    this.visible = true;
  }

  bomb(tx, ty) {
    new Bomb(bombs, this, tx, ty);
  }

  getDistanceToPlayer() {
    if (player) {
      return Math.sqrt(  Math.pow(player.x - this.x, 2) + Math.pow(player.y - this.y, 2) );
    }
  }

}
