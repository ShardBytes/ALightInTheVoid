/* DynamicEntity class by Plasmoxy, override this m8 */
/* uses Victor.js vector lib (may come in handy) */
/* this entity has velocity and moves to it */

class DynamicEntity extends Entity {

  constructor(id, sprite_texture) {
    super(id, sprite_texture);

    this.v = new Victor(); // velocity vector
  }

  move(dt) {
    this.x += this.v.x * (dt/60);
    this.y += this.v.y * (dt/60);
  }

  update(dt) {
    super.update(dt);
  }

}
