/* CircleCollider class by Plasmoxy */
/* this collider is also a fully meaningful one - a circle */
/* I used BoxCollider for everything before, even though literally every single object in the game is a circle, genius me :)))) */

class CircleCollider extends Collider {

  // you can add some offset borders to this colider if you want ;)
  constructor(ent, radiusOffset) {
    super(ent);

    this.ro = radiusOffset ? radiusOffset : 0;
    this.updateSize();
  }


  detect(dt, t) { // delta time, target

    if (!t) return; // if empty pointer, dont detect
    if (!this.active) return; // if not active, same

    let tcl = t.collider;
    let dx = t.x - this.ent.x;
    let dy = t.y - this.ent.y;

    /* !! -> angle = at what angle is TARGET entity colliding with THIS entity ?
     * ( we're looking at target entity from perspective of this entity and we see it under an angle -> )
     * yes this is copied from boxcollider
     */
    let angle = ( Math.atan2(dx, dy) + 2*PI ) % (2*PI); // get angle from 0 to 2PI as in circle.png

    // also if you are wondering why can't the colliders work together -> i've got enough math for this week ;)

    if ( tcl instanceof CircleCollider ) {

      if (!tcl.active) return; // if target collider not active, return too

      // if colliders intersect ( circles intersect )
      if (
        Math.sqrt(Math.pow(dy, 2) + Math.pow(dx, 2)) - this.r - tcl.r >= 0
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
      // will execute only on discollision (yes amazing name of event)
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

    this.debugGraphics.drawEllipse(
      -this.r/this.ent.scale.x,
      -this.r/this.ent.scale.y,
      2*this.r/this.ent.scale.x,
      2*this.r/this.ent.scale.y
    );
  }

  // IMPORTANT -> call this after scaling entity !
  // sets collider radius relative to entire entity width/2 ! ( women and children too :/ )
  updateSize() {
    this.r = this.ent.width/2 + this.ro;
  }

}
