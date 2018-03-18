/* this collider is a fully meaningful one - a box */

class BoxCollider extends Collider {

  constructor(ent, wOffset, hOffset) {
    super(ent);

    this.wo = wOffset;
    this.ho = wOffset;

    this.updateSize();
  }


  detect(dt, t) { // delta time, target
    let tcl = t.collider, angle;
    let dx = t.x - this.ent.x;
    let dy = t.y - this.ent.y;
    if ( tcl instanceof BoxCollider ) {
      if (
        ( Math.abs(dx)*2 < (this.w + tcl.w) ) &&
        ( Math.abs(dy)*2 < (this.h + tcl.h) )
      ){
        /* !! -> angle = at what angle is TARGET entity colliding with THIS entity ?
         * ( we're looking at target entity from perspective of this entity and we see it under an angle -> )
         */
        angle = ( Math.atan2(dx, dy) + 2*PI ) % (2*PI); // get angle from 0 to 2PI as in circle.png
        this.ent.colliding(dt, t, dx, dy, angle);
      }
    }
  }

  debug(state) {
    super.debug(state);
    if (!this.debugGraphics) return; // return if dG are off
    /* !!! ->  dgraphics will be scaled with the entity container, therefore to get a true rectangle size relative to parent even after scaling, we have to revert the scale. */
    this.debugGraphics.drawRect(
      -this.w/this.ent.scale.x/2,
      -this.h/this.ent.scale.y/2,
      this.w/this.ent.scale.x,
      this.h/this.ent.scale.y
    );
  }

  updateSize() { // IMPORTANT -> call this after scaling entity !
    this.w = this.ent.width + this.wo;
    this.h = this.ent.height + this.ho;
  }

}
