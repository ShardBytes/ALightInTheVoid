/* DynamicEntity class by Plasmoxy, override this m8 */
/* uses Victor.js vector lib (can come in handy) */

/* this can move and stuff */

class DynamicEntity extends Entity {

  get x() {return this.position.x;}
  set x(val) {this.position.x = val;}
  get y() {return this.position.y;}
  set y(val) {this.position.y = val;}

  constructor(id, sprite_texture) {
    super();

    this.id = id;

    // load sprite for entity
    this.sprite = new Sprite(sprite_texture);
    this.sprite.anchor.set(0.5, 0.5); // set sprite anchor to center
    this.addChild(this.sprite);

    this.collider = undefined;

    this.speed = 300; // speed [points per second]
    this.v = new Victor(); // velocity vector

  }

  move(dt) {
    this.x += this.v.x * (dt/60);
    this.y += this.v.y * (dt/60);
  }

  update(dt) {
    super.update(dt);
  }

  bounceBoxVelocityToAngle(ang) {
        if (
          ( ang <= 3*PI/4 && ang >= PI/4 ) ||
          ( ang <= -PI/4 && ang >= -3*PI/4)
        ) this.v.x = -this.v.x;
    else if (
        ( ang < PI/4 && ang > -PI/4 ) ||
        ( (ang < -3*PI/4 && ang > -PI ) || (ang > 3*PI/4 && ang < PI) )
      ) this.v.y = -this.v.y;
  }

}
