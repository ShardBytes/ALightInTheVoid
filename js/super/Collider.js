/* Simple collider superclass by Plasmoxy */
/* also this is just abstract class, need to derive it */

class Collider {

  // collider is attached to an entity
  constructor(ent) {
    this.ent = ent;
    this.detectPool = [];
  }

  // t = target entity
  detect(dt, t) {}

  // this setups the debug graphics, call super.debug() on override to save 3 lines of code lmao
  debug(state) {
    if (state) {
      this.debugGraphics = new PIXI.Graphics;
      this.debugGraphics.lineStyle(2, 0xFF0000, 1);
      this.ent.addChild(this.debugGraphics);
    } else {
      this.debugGraphics = undefined;
    }
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
    if (this.debugGraphics) this.updateDebugGraphics();
    this.detectPool.forEach( (t,i) => {
      this.detect(dt, t);
    });
  }

}
