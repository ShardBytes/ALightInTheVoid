
/* Bomb by Plasmoxy */
/* #idontknowaboutthis */

class Bomb extends Entity {

  constructor(swarm, emmiter, x, y, direction, directionalOffset) {
    super('@bomb', resources.healthpowerup.texture );
    this.sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST; // pixel mode
    this.sprite.scale.set(2,2);
    this.x = x;
    this.y = y;
    this.swarm = swarm;
    this.emmiter = emmiter;

    if (direction) {
      this.x += directionalOffset ? Math.sin(emmiter.direction)*directionalOffset : 0
      this.y += directionalOffset ? Math.cos(emmiter.direction)*directionalOffset : 0
    }

    this.damage = 50;
    this.explosionRadius = 200;

    this.collider = new CircleCollider(this);
    this.collider.r = 20;
    this.collider.debug(COLLIDER_DEBUG);

    // add all objects in the world as colliders except some
    world.children.forEach((a,i) => {
      if (
        a instanceof Entity &&
        a != safarik
      )this.collider.addToDetectionPool(a);
    });

    this.collider.collided = (t, dx, dy, ang) => {
      this.explode();
    };

    this.swarm.addChild(this);


    this.explTimer = setTimeout(() => { // self-destroy bomb after some time
      this.explode();
    }, 10000);

  }

  explode() {
    // clear timeout so it doesnt explode twice
    clearTimeout(this.explTimer);

    // remove and dereference after popping this function
    if (this.swarm.children.includes(this)) this.swarm.removeChild(this);

    // show animation
    new Apparition(world, 'expl_', '.png', 6, this.x, this.y, this.explosionRadius/60, 0.2);

    // play sound
    resources.explosionsound.sound.play();

    // distance between bomb and player
    let dp = Math.sqrt( Math.pow(player.x - this.x, 2) + Math.pow(player.y - this.y, 2) );
    // hit player if in radius
    if (dp <= this.explosionRadius) {
      player.hit(this.damage);
    }

    // chain to other bombs if in radius
    this.swarm.children.forEach((a,i) => {
      if (a != this && a instanceof Bomb) {
        // distance between bombs
        let db = Math.sqrt( Math.pow(a.x - this.x, 2) + Math.pow(a.y - this.y, 2) );
        if (db <= this.explosionRadius) {
          setTimeout( () => {a.explode();}, 200); // explode other with some delay
        }
      }
    });

  }

}
