/* Simple collider superclass by Plasmoxy */
/* also this is just abstract class, need to derive it */
/* its just like hey yo im a collider but i have no meaning in life ;_; */

class Collider {

  // collider is attached to an entity
  constructor(ent) {
    this.ent = ent;
    this.detectPool = []; // array of entities with colliders which this collider detects
    this.collisions = []; // list of objects with which this is colliding
    this.debugActive = false;
    this.active = true; // if collider is active
  }

  // t = target entity
  detect(dt, t) {}

  // OVERRIDE METHODS :
  colliding(dt, t, dx, dy, ang) {} // executes on every update if there is a collision
  collided(t, dx, dy, ang) {} // event, executes on collision
  discollided(t, dx, dy, ang) {} // event, executes when target leaves collision

  // this setups the debug graphics, call super.debug() on override to save 3 lines of code lmao
  // ! -> to be used only for internal testing
  debug(active) {
    if (active) {
      this.debugGraphics = new PIXI.Graphics;
      this.debugGraphics.lineStyle(2, 0xadff00, 1);
      this.ent.addChild(this.debugGraphics);
    } else {
      this.ent.removeChild(this.debugGraphics);
      this.debugGraphics = undefined;
    }
    this.debugActive = active;
  }

  // rotate the internal dgraphics opposite to entity rotation (because collider is not rotating)
  updateDebugGraphics() {
    this.debugGraphics.rotation = -this.ent.rotation;
  }

  addToDetectionPool(e) { // add entity to detection pool
    this.detectPool.push(e);
  }

  removeFromDetectionPool(e) {
    this.detectPool.splice(this.detectPool.indexOf(e), 1);
  }

  update(dt) {
    this.detectPool.forEach( (t,i) => {
      this.detect(dt, t);
    });
    if (this.debugActive && this.debugGraphics) this.updateDebugGraphics();
  }

  isColliding(target) {
    return this.collisions.includes(target);
  }

  // add and remove are unsafe to improve performance, check if isColliding() when using them !!!
  addCollision(target) {
    this.collisions.push(target);
  }

  removeCollision(target) {
    this.collisions.splice(this.collisions.indexOf(target), 1);
  }

}
