/* Entity class by Plasmoxy, override this m8 */

/* -> the basic advantage of my entity is based on Container polymorphism */
/*   -> therefore, you can add effects, internal entity graphics, and all that stuff to it */

class Entity extends Container {

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
  }

  update(dt) {}
  colliding(dt, t, dx, dy, ang) {}

}
