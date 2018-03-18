/* this collider is a fully meaningful one - a box */
/* ahhh and it workss and it finally has checks, events, offsets, all the stuff mmmmm <3 */

class BoxCollider extends Collider {

  // you can add some offset borders to this colider if you want ;)
  constructor(ent, wOffset, hOffset) {
    super(ent);

    this.wo = wOffset ? wOffset : 0;
    this.ho = hOffset ? hOffset : 0;
    this.updateSize();
  }


  detect(dt, t) { // delta time, target
    let tcl = t.collider;
    let dx = t.x - this.ent.x;
    let dy = t.y - this.ent.y;

    /* !! -> angle = at what angle is TARGET entity colliding with THIS entity ?
     * ( we're looking at target entity from perspective of this entity and we see it under an angle -> )
     */
    let angle = ( Math.atan2(dx, dy) + 2*PI ) % (2*PI); // get angle from 0 to 2PI as in circle.png

    if ( tcl instanceof BoxCollider ) {

      // if colliders overline
      if (
        ( Math.abs(dx)*2 < (this.w + tcl.w) ) &&
        ( Math.abs(dy)*2 < (this.h + tcl.h) )
      ) {
        // will execute only on collision
        if (!this.isColliding(t)) {
          this.addCollision(t); //try to add target to collisions
          this.collided(t, dx, dy, angle);
        }

        this.colliding(dt, t, dx, dy, angle);

      // if target is not colliding, remove target
      // (isColliding means there is a colision in collisions[]
      // so we need to remove it)
      // will execute only on discollision
      } else if(this.isColliding(t)) {
          this.removeCollision(t);
          this.discollided(t, dx, dy, angle);
      }
    }

  } // end detect

  // draw debug rect
  debug(state) {
    super.debug(state);
    if (!state) return; // return if debug is off
    /* !!! ->  dgraphics will be scaled with the entity container, therefore to get a true rectangle size relative to parent even after scaling, we have to revert the scale. */

    this.debugGraphics.drawRect(
      -this.w/this.ent.scale.x/2,
      -this.h/this.ent.scale.y/2,
      this.w/this.ent.scale.x,
      this.h/this.ent.scale.y
    );
  }

  // IMPORTANT -> call this after scaling entity !
  // because this is scaled with ent, i'm gonna rely on ent.sprite
  updateSize() {
    this.w = this.ent.width + this.wo;
    this.h = this.ent.height + this.ho;
  }

}
